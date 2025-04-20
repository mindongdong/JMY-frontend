"use client"

import { useState, useEffect } from "react"
import { useKeenSlider } from "keen-slider/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"

export default function Hero() {
  const isMobile = useMobile()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [instanceRef])

  const newsItems = [
    {
      id: 1,
      title: "2025년 전문연구요원 배정인원 발표, 작년 대비 10% 증가",
      source: "과학기술정보통신부",
      date: "2024.04.15",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "전문연구요원 제도 개선안 발표, 복무 기간 단축 검토 중",
      source: "병무청",
      date: "2024.04.10",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "대기업 연구소, 전문연구요원 채용 대폭 확대 계획 발표",
      source: "산업연구원",
      date: "2024.04.05",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <section className="relative min-h-screen bg-primary-50 pt-16 flex items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Hero Text */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              전문연구요원 채용,
              <br />
              한곳에서
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-md">
              분산된 전문연구요원 채용 정보를 실시간으로 모아 제공합니다. 최신 공고부터 마감 임박 공고까지 한눈에
              확인하세요.
            </p>
          </div>

          {/* Right: News Carousel */}
          <div className="relative">
            <div ref={sliderRef} className="keen-slider rounded-10 overflow-hidden shadow-md">
              {newsItems.map((item) => (
                <div key={item.id} className="keen-slider__slide">
                  <Card className="border-0 h-full">
                    <div className="relative aspect-video">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">
                        뉴스
                      </Badge>
                      <h3 className="font-semibold text-base mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{item.source}</span>
                        <span>{item.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {loaded && !isMobile && (
              <>
                <button
                  onClick={() => instanceRef.current?.prev()}
                  className="keen-slider__prev"
                  aria-label="이전 뉴스"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => instanceRef.current?.next()}
                  className="keen-slider__next"
                  aria-label="다음 뉴스"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Dots */}
            {loaded && (
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(newsItems.length)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === idx ? "bg-primary-600 w-4" : "bg-gray-300"
                    }`}
                    aria-label={`슬라이드 ${idx + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
