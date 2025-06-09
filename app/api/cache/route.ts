import { NextResponse } from "next/server"
import { cacheManager } from "@/lib/cache-manager"
import { clearCsvCache } from "@/lib/csv-data-mapper"

// 캐시 통계 조회
export async function GET() {
  try {
    const stats = cacheManager.getStats()
    
    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        memoryUsageMB: Math.round(stats.memoryUsage / 1024 / 1024 * 100) / 100,
        hitRateFormatted: `${Math.round(stats.hitRate * 100) / 100}%`
      },
      keys: cacheManager.keys()
    })
  } catch (error) {
    console.error("캐시 통계 조회 에러:", error)
    return NextResponse.json(
      { success: false, error: "캐시 통계를 조회할 수 없습니다." },
      { status: 500 }
    )
  }
}

// 캐시 정리 및 관리
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const key = searchParams.get('key')

    switch (action) {
      case 'cleanup':
        // 만료된 캐시 정리
        const removedCount = cacheManager.cleanup()
        return NextResponse.json({
          success: true,
          message: `${removedCount}개의 만료된 캐시 항목을 정리했습니다.`,
          removedCount
        })

      case 'clear':
        // 전체 캐시 클리어
        cacheManager.clear()
        clearCsvCache() // CSV 캐시도 클리어
        return NextResponse.json({
          success: true,
          message: "모든 캐시가 클리어되었습니다."
        })

      case 'delete':
        // 특정 키 삭제
        if (!key) {
          return NextResponse.json(
            { success: false, error: "삭제할 캐시 키를 지정해주세요." },
            { status: 400 }
          )
        }
        
        const deleted = cacheManager.delete(key)
        if (key === 'csv-data') {
          clearCsvCache()
        }
        
        return NextResponse.json({
          success: deleted,
          message: deleted ? `캐시 키 '${key}'가 삭제되었습니다.` : `캐시 키 '${key}'를 찾을 수 없습니다.`
        })

      default:
        return NextResponse.json(
          { success: false, error: "유효하지 않은 액션입니다. (cleanup, clear, delete)" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("캐시 관리 에러:", error)
    return NextResponse.json(
      { success: false, error: "캐시 관리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 