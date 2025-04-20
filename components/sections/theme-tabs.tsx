"use client"

import { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobCard, { type JobType } from "@/components/job-card"
import { useMobile } from "@/hooks/use-mobile"
import SectionHeader from "@/components/section-header"

type ThemeCategory = {
  id: string
  name: string
  jobs: JobType[]
}

export default function ThemeTabs() {
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState("ai")

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: isMobile ? 1.2 : 4,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 768px) and (max-width: 1279px)": {
        slides: { perView: 2.5, spacing: 16 },
      },
    },
  })

  // Mock data for theme categories
  const themeCategories: ThemeCategory[] = [
    {
      id: "ai",
      name: "인공지능",
      jobs: [
        {
          id: 1,
          title: "머신러닝 엔지니어 (전문연구요원)",
          company: "카카오",
          location: "판교",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["Python", "PyTorch", "NLP"],
          updatedAt: "1일 전",
          daysLeft: 14,
        },
        {
          id: 2,
          title: "컴퓨터 비전 연구원 (전문연)",
          company: "LG AI연구소",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["OpenCV", "딥러닝", "영상처리"],
          updatedAt: "2일 전",
          daysLeft: 10,
        },
        {
          id: 3,
          title: "AI 음성인식 개발자 (전문연구요원)",
          company: "네이버",
          location: "성남",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["음성인식", "신호처리", "TensorFlow"],
          updatedAt: "3일 전",
          daysLeft: 21,
        },
        {
          id: 4,
          title: "강화학습 연구원 (전문연)",
          company: "현대자동차",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["강화학습", "자율주행", "시뮬레이션"],
          updatedAt: "1일 전",
          daysLeft: 7,
        },
      ],
    },
    {
      id: "bio",
      name: "바이오",
      jobs: [
        {
          id: 1,
          title: "유전체 분석 연구원 (전문연구요원)",
          company: "마크로젠",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["유전체학", "바이오인포매틱스", "NGS"],
          updatedAt: "1일 전",
          daysLeft: 14,
        },
        {
          id: 2,
          title: "면역학 연구원 (전문연)",
          company: "녹십자",
          location: "용인",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["면역학", "세포생물학", "항체"],
          updatedAt: "2일 전",
          daysLeft: 10,
        },
        {
          id: 3,
          title: "단백질 구조 연구원 (전문연구요원)",
          company: "한국생명공학연구원",
          location: "대전",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["구조생물학", "X-ray 결정학", "단백질공학"],
          updatedAt: "3일 전",
          daysLeft: 21,
        },
      ],
    },
    {
      id: "robot",
      name: "로봇",
      jobs: [
        {
          id: 1,
          title: "로봇 제어 엔지니어 (전문연구요원)",
          company: "두산로보틱스",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["제어공학", "모션제어", "ROS"],
          updatedAt: "1일 전",
          daysLeft: 14,
        },
        {
          id: 2,
          title: "휴머노이드 개발자 (전문연)",
          company: "한국로봇융합연구원",
          location: "대구",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["휴머노이드", "동역학", "기구학"],
          updatedAt: "2일 전",
          daysLeft: 10,
        },
      ],
    },
    {
      id: "bigdata",
      name: "빅데이터",
      jobs: [
        {
          id: 1,
          title: "데이터 사이언티스트 (전문연구요원)",
          company: "쿠팡",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["Python", "R", "통계학"],
          updatedAt: "1일 전",
          daysLeft: 14,
        },
        {
          id: 2,
          title: "빅데이터 플랫폼 개발자 (전문연)",
          company: "SK텔레콤",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["Hadoop", "Spark", "분산시스템"],
          updatedAt: "2일 전",
          daysLeft: 10,
        },
      ],
    },
  ]

  return (
    <section>
      <SectionHeader title="분야별 채용 공고" href="/themes" />

      <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="mb-4 bg-gray-100 p-1 overflow-x-auto flex w-full justify-start md:justify-center">
          {themeCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-primary-600"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {themeCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="relative">
              <div ref={sliderRef} className="keen-slider">
                {category.jobs.map((job) => (
                  <div key={job.id} className="keen-slider__slide">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>

              {!isMobile && category.jobs.length > 4 && (
                <>
                  <button
                    onClick={() => instanceRef.current?.prev()}
                    className="keen-slider__prev"
                    aria-label={`이전 ${category.name} 공고`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => instanceRef.current?.next()}
                    className="keen-slider__next"
                    aria-label={`다음 ${category.name} 공고`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
