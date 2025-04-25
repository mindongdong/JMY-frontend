"use client"

import { useKeenSlider } from "keen-slider/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import JobCard, { type JobType } from "@/components/job-card"
import { useMobile } from "@/hooks/use-mobile"
import SectionHeader from "@/components/section-header"

export default function LatestJobs() {
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

  // Mock data
  const jobs: JobType[] = [
    {
      id: 1,
      title: "인공지능 연구원 (전문연구요원)",
      company: "삼성전자",
      location: "서울",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["Python", "TensorFlow", "Computer Vision"],
      updatedAt: "2시간 전",
      daysLeft: 14,
      source: "RNDJOB",
      url: "https://example.com/job/1",
    },
    {
      id: 2,
      title: "반도체 공정 엔지니어 (전문연)",
      company: "SK하이닉스",
      location: "경기",
      thumbnail: "/placeholder.svg?height=180&width=320",
      keywords: ["반도체", "공정설계", "물리학"],
      updatedAt: "3시간 전",
      daysLeft: 10,
      source: "병역일터",
      url: "https://example.com/job/2",
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
      source: "both",
      url: "https://example.com/job/3",
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
      source: "RNDJOB",
      url: "https://example.com/job/4",
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
      source: "병역일터",
      url: "https://example.com/job/5",
    },
  ]

  return (
    <section>
      <SectionHeader title="최신 채용 공고" href="/jobs" />

      <div className="relative mt-4">
        <div ref={sliderRef} className="keen-slider">
          {jobs.map((job) => (
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
              aria-label="이전 채용 공고"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="keen-slider__next"
              aria-label="다음 채용 공고"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
