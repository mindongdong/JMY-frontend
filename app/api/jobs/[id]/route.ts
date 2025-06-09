import { NextResponse } from "next/server"
import { loadCsvData, csvToJobDetail } from "@/lib/csv-data-mapper"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    
    // 입력값 검증 강화
    if (isNaN(id) || id <= 0 || id > 999999) { // 최대 ID 제한 추가
      return NextResponse.json(
        { error: "유효하지 않은 채용공고 ID입니다." }, 
        { status: 400 }
      )
    }

    // CSV 데이터 로드 (캐싱 적용)
    const csvData = await loadCsvData()
    
    if (csvData.length === 0) {
      return NextResponse.json(
        { error: "데이터를 불러올 수 없습니다." }, 
        { status: 500 }
      )
    }

    // ID는 1부터 시작하므로 배열 인덱스로 변환 (id - 1)
    const jobData = csvData[id - 1]
    
    if (!jobData) {
      return NextResponse.json(
        { error: "채용공고를 찾을 수 없습니다." }, 
        { status: 404 }
      )
    }

    // CSV 데이터를 JobDetail로 변환
    const jobDetail = csvToJobDetail(jobData, id)

    return NextResponse.json({ job: jobDetail })

  } catch (error) {
    console.error("채용공고 상세 조회 에러:", error)
    
    // 에러 타입에 따른 세분화된 응답
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "채용공고를 불러오는 중 오류가 발생했습니다." }, 
      { status: 500 }
    )
  }
}