import { NextResponse } from "next/server"
import type { JobDetail } from "@/types/job-detail"

// 더미 데이터
const jobDetails: Record<number, JobDetail> = {
  1: {
    id: 1,
    post_name: "[삼성전자] 2025년 상반기 인공지능 연구원 전문연구요원 채용",
    company_name: "삼성전자",
    deadline: "2025-07-31",
    registration_date: "2025-06-15",
    region: "서울특별시 강남구 테헤란로 86길 19",
    field: "인공지능/머신러닝",
    qualification_agent: "신규, 편입",
    qualification_education: "석사 이상",
    qualification_career: "신입/경력 (3년 이하)",
    keywords_list: `1. 담당업무
- 딥러닝 모델 개발 및 최적화
- 컴퓨터 비전 알고리즘 연구
- AI 서비스 기획 및 개발

2. 자격요건
- 컴퓨터공학, 전자공학, 수학 등 관련 학과 석사 이상
- Python, TensorFlow, PyTorch 활용 가능자
- 논문 게재 경험 우대

3. 우대사항
- AI 관련 프로젝트 경험
- 오픈소스 기여 경험
- 영어 가능자

4. 근무조건
- 근무지: 서울 강남구 (삼성전자 본사)
- 근무형태: 정규직
- 급여: 회사 내규에 따름

5. 지원방법
- 온라인 지원: https://careers.samsung.com
- 제출서류: 이력서, 자기소개서, 포트폴리오`,
    source_info: "https://careers.samsung.com/kr/job/1234",
    source_type: "RNDJOB",
    thumbnail: "/placeholder.svg?height=300&width=600",
    keywords: ["Python", "TensorFlow", "Computer Vision"],
  },
  2: {
    id: 2,
    post_name: "[SK하이닉스] 반도체 공정 엔지니어 전문연구요원 모집",
    company_name: "SK하이닉스",
    deadline: "2025-06-25",
    registration_date: "2025-06-10",
    region: "경기도 이천시 부발읍 경충대로 2091",
    field: "반도체/전자",
    qualification_agent: "신규",
    qualification_education: "학사 이상",
    qualification_career: "신입",
    keywords_list: [
      "1. 주요업무",
      "- 반도체 공정 개발 및 최적화",
      "- 수율 향상을 위한 분석 및 개선",
      "- 신규 공정 기술 연구",
      "",
      "2. 지원자격",
      "- 전자공학, 재료공학, 화학공학 관련 학과",
      "- 반도체 공정에 대한 기본 지식",
      "- 영어 가능자 우대",
    ],
    source_info: "https://careers.skhynix.com/job/2345",
    source_type: "병역일터",
    thumbnail: "/placeholder.svg?height=300&width=600",
    keywords: ["반도체", "공정설계", "물리학"],
  },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const jobDetail = jobDetails[id]

  if (!jobDetail) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  // 1초 지연 (실제 API 호출 시뮬레이션)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({ job: jobDetail })
}
