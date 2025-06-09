// 검색 관련 유틸리티 함수들

// 검색어 하이라이팅
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm || !text) return text
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

// 정규식 특수문자 이스케이프
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 검색 점수 계산 (관련도 순 정렬을 위함)
export function calculateSearchScore(
  item: { title: string; company: string; keywords: string[]; location: string },
  searchTerm: string
): number {
  if (!searchTerm) return 0
  
  const term = searchTerm.toLowerCase()
  let score = 0
  
  // 제목에서 완전 일치 (높은 점수)
  if (item.title.toLowerCase() === term) score += 100
  else if (item.title.toLowerCase().includes(term)) score += 50
  
  // 회사명에서 완전 일치
  if (item.company.toLowerCase() === term) score += 80
  else if (item.company.toLowerCase().includes(term)) score += 40
  
  // 키워드에서 완전 일치
  const exactKeywordMatch = item.keywords.some(k => k.toLowerCase() === term)
  if (exactKeywordMatch) score += 60
  else {
    const partialKeywordMatch = item.keywords.some(k => k.toLowerCase().includes(term))
    if (partialKeywordMatch) score += 30
  }
  
  // 지역에서 일치
  if (item.location.toLowerCase().includes(term)) score += 20
  
  // 제목 시작 부분 일치 (추가 보너스)
  if (item.title.toLowerCase().startsWith(term)) score += 25
  
  return score
}

// 검색어 제안 (자동완성용)
export function generateSearchSuggestions(
  items: { title: string; company: string; keywords: string[] }[],
  searchTerm: string,
  limit: number = 5
): string[] {
  if (!searchTerm || searchTerm.length < 2) return []
  
  const term = searchTerm.toLowerCase()
  const suggestions = new Set<string>()
  
  // 회사명에서 제안
  items.forEach(item => {
    if (item.company.toLowerCase().includes(term)) {
      suggestions.add(item.company)
    }
  })
  
  // 키워드에서 제안
  items.forEach(item => {
    item.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(term)) {
        suggestions.add(keyword)
      }
    })
  })
  
  // 제목에서 단어 추출하여 제안
  items.forEach(item => {
    const words = item.title.split(/\s+/)
    words.forEach(word => {
      if (word.toLowerCase().includes(term) && word.length >= 2) {
        suggestions.add(word)
      }
    })
  })
  
  return Array.from(suggestions)
    .sort((a, b) => {
      // 검색어로 시작하는 것을 우선
      const aStarts = a.toLowerCase().startsWith(term)
      const bStarts = b.toLowerCase().startsWith(term)
      
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      
      // 길이가 짧은 것을 우선 (더 정확한 일치)
      return a.length - b.length
    })
    .slice(0, limit)
}

// 검색 통계
export interface SearchStats {
  totalResults: number
  searchTime: number
  filters: {
    keyword?: string
    source?: string
    location?: string
  }
  suggestions: string[]
}

// 검색 실행 및 통계 생성
export function executeSearch<T extends { title: string; company: string; keywords: string[]; location: string }>(
  items: T[],
  filters: {
    keyword?: string
    source?: string
    location?: string
  }
): { results: T[]; stats: SearchStats } {
  const startTime = performance.now()
  
  let results = [...items]
  
  // 필터링 적용
  if (filters.keyword) {
    results = results.filter(item => {
      const term = filters.keyword!.toLowerCase()
      return (
        item.title.toLowerCase().includes(term) ||
        item.company.toLowerCase().includes(term) ||
        item.keywords.some(k => k.toLowerCase().includes(term)) ||
        item.location.toLowerCase().includes(term)
      )
    })
    
    // 관련도 순으로 정렬
    results.sort((a, b) => {
      const scoreA = calculateSearchScore(a, filters.keyword!)
      const scoreB = calculateSearchScore(b, filters.keyword!)
      return scoreB - scoreA
    })
  }
  
  if (filters.source) {
    results = results.filter(item => 
      'source' in item && (item as any).source === filters.source
    )
  }
  
  if (filters.location) {
    results = results.filter(item => 
      item.location.toLowerCase().includes(filters.location!.toLowerCase())
    )
  }
  
  const endTime = performance.now()
  const searchTime = Math.round((endTime - startTime) * 100) / 100
  
  // 검색 제안 생성
  const suggestions = filters.keyword ? 
    generateSearchSuggestions(items, filters.keyword) : []
  
  const stats: SearchStats = {
    totalResults: results.length,
    searchTime,
    filters,
    suggestions
  }
  
  return { results, stats }
}

// 검색 히스토리 관리 (로컬 스토리지 사용)
export class SearchHistory {
  private static readonly STORAGE_KEY = 'search_history'
  private static readonly MAX_ITEMS = 10
  
  static add(searchTerm: string): void {
    if (typeof window === 'undefined' || !searchTerm.trim()) return
    
    const history = this.get()
    const filteredHistory = history.filter(term => term !== searchTerm)
    filteredHistory.unshift(searchTerm)
    
    const trimmedHistory = filteredHistory.slice(0, this.MAX_ITEMS)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedHistory))
  }
  
  static get(): string[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
  
  static remove(searchTerm: string): void {
    if (typeof window === 'undefined') return
    
    const history = this.get().filter(term => term !== searchTerm)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history))
  }
  
  static clear(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.STORAGE_KEY)
  }
} 