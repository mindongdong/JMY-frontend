import { NextResponse } from "next/server"
import type { JobSource } from "@/components/job-card"
import { loadCsvData, csvToJobType, filterJobs, sortJobs } from "@/lib/csv-data-mapper"

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url)
    const source = searchParams.get("source") as JobSource | null
    const keyword = searchParams.get("keyword")
    const location = searchParams.get("location")
    const sortBy = (searchParams.get("sortBy") as 'recent' | 'deadline' | 'company') || 'recent'
    
    // 입력값 검증
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20"))) // 최대 100개로 제한

    // 키워드 길이 제한 (보안)
    if (keyword && keyword.length > 100) {
      return NextResponse.json({
        jobs: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
        error: "검색 키워드가 너무 깁니다."
      }, { status: 400 })
    }

    // CSV 데이터 로드 (캐싱 적용)
    const csvData = await loadCsvData()
    
    if (csvData.length === 0) {
      return NextResponse.json({ 
        jobs: [], 
        total: 0, 
        page: 1, 
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
        message: "데이터를 불러올 수 없습니다." 
      })
    }

    // CSV 데이터를 JobType으로 변환
    let jobs = csvData.map((row, index) => csvToJobType(row, index))

    // 필터링 적용
    jobs = filterJobs(jobs, {
      keyword: keyword || undefined,
      source: source || undefined,
      location: location || undefined
    })

    // 정렬 적용
    jobs = sortJobs(jobs, sortBy)

    // 페이지네이션 적용
    const total = jobs.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedJobs = jobs.slice(startIndex, endIndex)

    return NextResponse.json({ 
      jobs: paginatedJobs,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    })

  } catch (error) {
    console.error("채용공고 조회 에러:", error)
    return NextResponse.json(
      { 
        jobs: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
        error: "채용공고를 불러오는 중 오류가 발생했습니다."
      }, 
      { status: 500 }
    )
  }
}