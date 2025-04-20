import { NextResponse } from "next/server"
import type { JobType } from "@/components/job-card"

// 더미 데이터 생성 함수
function generateDummyJobs(): JobType[] {
  return [
    {
      id: 1,
      title: "인공지능 연구원 (전문연구요원)",
      company: "삼성전자",
      location: "서울",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["Python", "TensorFlow", "Computer Vision"],
      updatedAt: "2시간 전",
      daysLeft: 14,
    },
    {
      id: 2,
      title: "반도체 공정 엔지니어 (전문연)",
      company: "SK하이닉스",
      location: "경기",
      ation: "경기",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["반도체", "공정설계", "물리학"],
      updatedAt: "3시간 전",
      daysLeft: 10,
    },
    {
      id: 3,
      title: "바이오 연구원 (전문연구요원)",
      company: "셀트리온",
      location: "인천",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["생명공학", "단백질공학", "분자생물학"],
      updatedAt: "5시간 전",
      daysLeft: 21,
    },
    {
      id: 4,
      title: "로봇공학 연구원 (전문연)",
      company: "현대로보틱스",
      location: "대전",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["로봇공학", "제어시스템", "C++"],
      updatedAt: "6시간 전",
      daysLeft: 7,
    },
    {
      id: 5,
      title: "빅데이터 분석가 (전문연구요원)",
      company: "네이버",
      location: "성남",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["Hadoop", "Spark", "데이터마이닝"],
      updatedAt: "12시간 전",
      daysLeft: 30,
    },
    // 마감 임박 공고
    {
      id: 6,
      title: "양자컴퓨팅 연구원 (전문연구요원)",
      company: "LG전자",
      location: "서울",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["양자물리", "알고리즘", "수학"],
      updatedAt: "1일 전",
      daysLeft: 2,
      isUrgent: true,
    },
    {
      id: 7,
      title: "신약개발 연구원 (전문연)",
      company: "한국화학연구원",
      location: "대전",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["약학", "화학", "분자모델링"],
      updatedAt: "2일 전",
      daysLeft: 3,
      isUrgent: true,
    },
  ]
}

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 가져오거나 외부 API를 호출할 수 있습니다.
  const jobs = generateDummyJobs()

  // 1초 지연 (실제 API 호출 시뮬레이션)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({ jobs })
}
