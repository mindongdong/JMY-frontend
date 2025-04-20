"use client"

import { useKeenSlider } from "keen-slider/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import JobCard, { type JobType } from "@/components/job-card"
import { useMobile } from "@/hooks/use-mobile"
import SectionHeader from "@/components/section-header"

export default function ClosingSoon() {
  const isMobile = useMobile()

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

  // Mock data - Closing soon jobs (D-7 or less)
  const closingJobs: JobType[] = [
    {
      id: 1,
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
      id: 2,
      title: "신약개발 연구원 (전문연)",
      company: "한국화학연구원",
      location: "대전",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["약학", "화학", "분자모델링"],
      updatedAt: "2일 전",
      daysLeft: 3,
      isUrgent: true,
    },
    {
      id: 3,
      title: "자율주행 SW 개발자 (전문연구요원)",
      company: "현대자동차",
      location: "경기",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["자율주행", "컴퓨터비전", "C++"],
      updatedAt: "3일 전",
      daysLeft: 5,
      isUrgent: true,
    },
    {
      id: 4,
      title: "통신 프로토콜 연구원 (전문연)",
      company: "KT",
      location: "서울",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["5G", "네트워크", "통신공학"],
      updatedAt: "1일 전",
      daysLeft: 1,
      isUrgent: true,
    },
    {
      id: 5,
      title: "디스플레이 소재 연구원 (전문연)",
      company: "삼성디스플레이",
      location: "용인",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["재료공학", "화학", "OLED"],
      updatedAt: "2일 전",
      daysLeft: 7,
      isUrgent: true,
    },
  ]

  return (
    <section>
      <SectionHeader title="마감 임박 공고" href="/closing-soon" variant="warning" />

      <div className="relative mt-4">
        <div ref={sliderRef} className="keen-slider">
          {closingJobs.map((job) => (
            <div key={job.id} className="keen-slider__slide">
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {!isMobile && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="keen-slider__prev"
              aria-label="이전 마감 임박 공고"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="keen-slider__next"
              aria-label="다음 마감 임박 공고"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
