// 캐시 관리 유틸리티
interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

interface CacheStats {
  totalItems: number
  totalHits: number
  totalMisses: number
  hitRate: number
  memoryUsage: number
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>()
  private hits = 0
  private misses = 0

  // 캐시에 데이터 저장
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    })
  }

  // 캐시에서 데이터 조회
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      this.misses++
      return null
    }

    // TTL 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      this.misses++
      return null
    }

    item.hits++
    this.hits++
    return item.data as T
  }

  // 특정 키의 캐시 삭제
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // 전체 캐시 클리어
  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  // 만료된 캐시 항목 정리
  cleanup(): number {
    const now = Date.now()
    let removed = 0

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
        removed++
      }
    }

    return removed
  }

  // 캐시 통계
  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses
    
    return {
      totalItems: this.cache.size,
      totalHits: this.hits,
      totalMisses: this.misses,
      hitRate: totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0,
      memoryUsage: this.getMemoryUsage()
    }
  }

  // 메모리 사용량 추정 (바이트 단위)
  private getMemoryUsage(): number {
    let usage = 0
    
    for (const [key, item] of this.cache.entries()) {
      // 키와 메타데이터 크기 추정
      usage += key.length * 2 // UTF-16
      usage += 64 // 메타데이터 (timestamp, ttl, hits)
      
      // 데이터 크기 추정
      try {
        usage += new Blob([JSON.stringify(item.data)]).size
      } catch {
        usage += 1024 // 추정값
      }
    }
    
    return usage
  }

  // 캐시 키 목록
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // 캐시 크기
  size(): number {
    return this.cache.size
  }
}

// 전역 캐시 매니저 인스턴스
export const cacheManager = new CacheManager()

// 자동 정리 작업 (10분마다 실행)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const removed = cacheManager.cleanup()
    if (removed > 0) {
      console.log(`Cache cleanup: ${removed} expired items removed`)
    }
  }, 10 * 60 * 1000)
}

export default CacheManager 