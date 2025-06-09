import Papa from 'papaparse'
import type { JobDetail } from '@/types/job-detail'
import type { JobType, JobSource } from '@/components/job-card'
import fs from 'fs'
import path from 'path'

// CSV 원본 데이터 타입
interface CsvJobData {
  company_name: string
  post_name: string
  registration_date: string
  deadline: string
  qualification_agent: string
  qualification_education: string
  qualification_career: string
  region: string
  Field: string
  keywords_list: string
  source_info: string
  source_type: string
  update_date: string
  status: string
}

// 캐시 인터페이스
interface CacheData {
  data: CsvJobData[]
  lastModified: number
  timestamp: number
}

// 메모리 캐시 (TTL: 5분)
let csvCache: CacheData | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5분

// CSV 파일 읽기 함수 (캐싱 적용)
export async function loadCsvData(): Promise<CsvJobData[]> {
  try {
    const csvFilePath = path.join(process.cwd(), 'data', 'processed_job_data.csv')
    
    // 경로 주입 공격 방지를 위한 검증
    const normalizedPath = path.normalize(csvFilePath)
    if (!normalizedPath.startsWith(path.join(process.cwd(), 'data'))) {
      throw new Error('Invalid file path')
    }

    // 파일 통계 확인
    const stats = fs.statSync(csvFilePath)
    const currentTime = Date.now()
    
    // 캐시가 유효한지 확인
    if (csvCache && 
        csvCache.lastModified === stats.mtimeMs && 
        (currentTime - csvCache.timestamp) < CACHE_TTL) {
      console.log('CSV data loaded from cache')
      return csvCache.data
    }

    console.log('Loading CSV data from file')
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8')
    
    const result = Papa.parse<CsvJobData>(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // 모든 값을 문자열로 처리
      transform: (value: string) => value.trim() // 공백 제거
    })

    if (result.errors.length > 0) {
      console.error('CSV 파싱 에러:', result.errors)
    }

    // 캐시 업데이트
    csvCache = {
      data: result.data,
      lastModified: stats.mtimeMs,
      timestamp: currentTime
    }

    return result.data
  } catch (error) {
    console.error('CSV 파일 읽기 에러:', error)
    return []
  }
}

// 캐시 클리어 함수 (필요시 사용)
export function clearCsvCache(): void {
  csvCache = null
  console.log('CSV cache cleared')
}

// CSV 데이터를 JobType 형식으로 변환
export function csvToJobType(csvData: CsvJobData, index: number): JobType {
  // D-day 계산
  const calculateDaysLeft = (deadline: string): number => {
    try {
      if (deadline === '상시채용' || deadline === '채용시 마감') {
        return 999 // 상시채용인 경우 큰 수로 설정
      }
      
      const deadlineDate = new Date(deadline)
      const today = new Date()
      const diffTime = deadlineDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return Math.max(0, diffDays)
    } catch {
      return 30 // 파싱 실패시 기본값
    }
  }

  // 업데이트 시간 계산 (상대적 시간)
  const getRelativeTime = (updateDate: string): string => {
    try {
      const update = new Date(updateDate)
      const now = new Date()
      const diffHours = Math.floor((now.getTime() - update.getTime()) / (1000 * 60 * 60))
      
      if (diffHours < 1) return '방금 전'
      if (diffHours < 24) return `${diffHours}시간 전`
      
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}일 전`
    } catch {
      return '최근'
    }
  }

  // 키워드 추출 (Field와 keywords_list에서)
  const extractKeywords = (field: string, keywordsList: string): string[] => {
    const keywords: string[] = []
    
    // Field에서 키워드 추출
    if (field) {
      // 기술 스택이나 직무 관련 키워드 추출
      const fieldKeywords = field.match(/\b(Java|Python|React|AI|ML|데이터|서버|프론트엔드|백엔드|DevOps|클라우드|Docker|Kubernetes|AWS)\b/gi)
      if (fieldKeywords) {
        keywords.push(...fieldKeywords.slice(0, 3))
      }
    }

    // keywords_list에서 추가 키워드 추출
    if (keywordsList && keywords.length < 3) {
      const additionalKeywords = keywordsList.match(/\b(Spring|Node\.js|TypeScript|PostgreSQL|MySQL|Redis|Elasticsearch|TensorFlow|PyTorch)\b/gi)
      if (additionalKeywords) {
        keywords.push(...additionalKeywords.slice(0, 3 - keywords.length))
      }
    }

    // 기본 키워드가 부족한 경우 직무 분야 기반으로 추가
    if (keywords.length === 0) {
      if (field.includes('AI') || field.includes('ML')) {
        keywords.push('AI', 'ML', 'Python')
      } else if (field.includes('프론트엔드') || field.includes('React')) {
        keywords.push('React', 'JavaScript', 'TypeScript')
      } else if (field.includes('백엔드') || field.includes('서버')) {
        keywords.push('Java', 'Spring', 'Database')
      } else {
        keywords.push('개발', '연구', '기술')
      }
    }

    return keywords.slice(0, 3)
  }

  const daysLeft = calculateDaysLeft(csvData.deadline)
  
  // source_type을 JobSource로 변환
  const getJobSource = (sourceType: string): JobSource => {
    switch (sourceType.toLowerCase()) {
      case 'military':
        return '병역일터'
      case 'rndjob':
        return 'RNDJOB'
      default:
        return 'RNDJOB' // 기본값
    }
  }
  
  return {
    id: index + 1, // CSV 인덱스 기반 ID
    title: csvData.post_name,
    company: csvData.company_name,
    location: csvData.region.split(' ')[0] || '전국', // 첫 번째 주소 부분만 사용
    thumbnail: "/placeholder.svg?height=180&width=320",
    keywords: extractKeywords(csvData.Field, csvData.keywords_list),
    updatedAt: getRelativeTime(csvData.update_date),
    daysLeft: daysLeft,
    isUrgent: daysLeft <= 7 && daysLeft > 0,
    source: getJobSource(csvData.source_type),
    url: csvData.source_info,
    registrationDate: csvData.registration_date // 정렬을 위해 추가
  }
}

// CSV 데이터를 JobDetail 형식으로 변환
export function csvToJobDetail(csvData: CsvJobData, id: number): JobDetail {
  return {
    id: id,
    post_name: csvData.post_name,
    company_name: csvData.company_name,
    deadline: csvData.deadline,
    registration_date: csvData.registration_date,
    region: csvData.region,
    field: csvData.Field,
    qualification_agent: csvData.qualification_agent,
    qualification_education: csvData.qualification_education,
    qualification_career: csvData.qualification_career,
    keywords_list: csvData.keywords_list,
    source_info: csvData.source_info,
    source_type: csvData.source_type === 'military' ? '병역일터' : 'RNDJOB',
    thumbnail: "/placeholder.svg?height=300&width=600",
    keywords: extractKeywordsFromContent(csvData.keywords_list, csvData.Field)
  }
}

// 콘텐츠에서 기술 키워드 추출
function extractKeywordsFromContent(content: string, field: string): string[] {
  const techKeywords = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
    'Node.js', 'Spring', 'Django', 'Flask', 'Express',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'AWS', 'Docker', 'Kubernetes', 'Jenkins',
    'TensorFlow', 'PyTorch', 'OpenCV', 'Pandas', 'NumPy',
    'Machine Learning', 'Deep Learning', 'AI', 'ML',
    'REST API', 'GraphQL', 'Microservices',
    'Git', 'GitHub', 'GitLab'
  ]

  const foundKeywords = techKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase()) ||
    field.toLowerCase().includes(keyword.toLowerCase())
  )

  return foundKeywords.slice(0, 5) // 최대 5개
}

// 검색 및 필터링 함수 (타입 수정)
export function filterJobs(
  jobs: JobType[],
  filters: {
    keyword?: string
    source?: JobSource | 'all'
    location?: string
  }
): JobType[] {
  return jobs.filter(job => {
    // 키워드 검색 (개선된 검색 로직)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      const matchesKeyword = 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.keywords.some(k => k.toLowerCase().includes(keyword))
      
      if (!matchesKeyword) return false
    }

    // 출처 필터 (타입 수정)
    if (filters.source && filters.source !== 'all') {
      if (job.source !== filters.source) return false
    }

    // 지역 필터
    if (filters.location) {
      const location = filters.location.toLowerCase()
      if (!job.location.toLowerCase().includes(location)) return false
    }

    return true
  })
}

// 정렬 함수 (개선된 정렬 로직)
export function sortJobs(jobs: JobType[], sortBy: 'recent' | 'deadline' | 'company'): JobType[] {
  return [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        // 최신순 (registrationDate 기준)
        try {
          const dateA = new Date(a.registrationDate || '').getTime()
          const dateB = new Date(b.registrationDate || '').getTime()
          return dateB - dateA // 최신이 먼저
        } catch {
          return 0
        }
      case 'deadline':
        // 마감임박순 (daysLeft 기준)
        if (a.daysLeft === b.daysLeft) {
          // daysLeft가 같으면 회사명순으로 2차 정렬
          return a.company.localeCompare(b.company)
        }
        return a.daysLeft - b.daysLeft
      case 'company':
        // 회사명순 (한글 정렬 지원)
        return a.company.localeCompare(b.company, 'ko-KR')
      default:
        return 0
    }
  })
}