"use client"

import { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import JobCard, { type JobType } from "@/components/job-card"
import { useMobile } from "@/hooks/use-mobile"
import SectionHeader from "@/components/section-header"

type Region = {
  id: string
  name: string
  jobs: JobType[]
}

export default function ByRegion() {
  const isMobile = useMobile()
  const [activeRegion, setActiveRegion] = useState<string>("seoul")
  const [mapOpen, setMapOpen] = useState(false)

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

  // Mock data for regions
  const regions: Region[] = [
    {
      id: "seoul",
      name: "서울",
      jobs: [
        {
          id: 1,
          title: "반도체 설계 엔지니어 (전문연구요원)",
          company: "삼성전자",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["VLSI", "회로설계", "Verilog"],
          updatedAt: "1일 전",
          daysLeft: 14,
        },
        {
          id: 2,
          title: "통신 프로토콜 연구원 (전문연)",
          company: "KT",
          location: "서울",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["5G", "네트워크", "통신공학"],
          updatedAt: "2일 전",
          daysLeft: 10,
        },
      ],
    },
    {
      id: "gyeonggi",
      name: "경기",
      jobs: [
        {
          id: 1,
          title: "자율주행 SW 개발자 (전문연구요원)",
          company: "현대자동차",
          location: "화성",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["자율주행", "컴퓨터비전", "C++"],
          updatedAt: "1일 전",
          daysLeft: 14,
        },
        {
          id: 2,
          title: "디스플레이 소재 연구원 (전문연)",
          company: "삼성디스플레이",
          location: "용인",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["재료공학", "화학", "OLED"],
          updatedAt: "2일 전",
          daysLeft: 10,
        },
      ],
    },
    {
      id: "daejeon",
      name: "대전",
      jobs: [
        {
          id: 1,
          title: "신약개발 연구원 (전문연구요원)",
          company: "한국화학연구원",
          location: "대전",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["약학", "화학", "분자모델링"],
          updatedAt: "1일 전",
          daysLeft: 14,
        },
        {
          id: 2,
          title: "양자암호 연구원 (전문연)",
          company: "한국전자통신연구원",
          location: "대전",
          thumbnail: "/placeholder.svg?height=180&width=320",
          keywords: ["암호학", "양자컴퓨팅", "정보보안"],
          updatedAt: "2일 전",
          daysLeft: 10,
        },
      ],
    },
  ]

  const currentRegion = regions.find((r) => r.id === activeRegion) || regions[0]

  return (
    <section>
      <SectionHeader title="지역별 채용 공고" href="/regions" />

      <div className="mt-4">
        <Sheet open={mapOpen} onOpenChange={setMapOpen}>
          <SheetTrigger asChild>
            <div className="relative cursor-pointer mb-6 mx-auto w-full max-w-3xl">
              <div className="bg-gray-100 rounded-10 overflow-hidden aspect-[16/9] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                  <p className="text-gray-700">지도에서 지역별 공고 보기</p>
                  <p className="text-sm text-gray-500 mt-1">클릭하여 확장</p>
                </div>
              </div>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle>지역별 채용 공고</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => setMapOpen(false)} aria-label="닫기">
                <X className="h-4 w-4" />
              </Button>
            </SheetHeader>
            <div className="mt-4 h-[calc(80vh-80px)] overflow-y-auto">
              <div className="bg-gray-100 rounded-10 overflow-hidden aspect-[16/9] flex items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-gray-700">지도 영역 (실제 구현 시 지도 API 연동)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={activeRegion === region.id ? "default" : "outline"}
                    className={activeRegion === region.id ? "bg-primary-600" : ""}
                    onClick={() => setActiveRegion(region.id)}
                  >
                    {region.name} ({region.jobs.length})
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentRegion.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {regions.map((region) => (
            <Button
              key={region.id}
              variant={activeRegion === region.id ? "default" : "outline"}
              className={`flex-shrink-0 ${activeRegion === region.id ? "bg-primary-600" : ""}`}
              onClick={() => setActiveRegion(region.id)}
            >
              {region.name}
            </Button>
          ))}
        </div>

        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {currentRegion.jobs.map((job) => (
              <div key={job.id} className="keen-slider__slide">
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {!isMobile && currentRegion.jobs.length > 4 && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="keen-slider__prev"
                aria-label={`이전 ${currentRegion.name} 공고`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="keen-slider__next"
                aria-label={`다음 ${currentRegion.name} 공고`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
