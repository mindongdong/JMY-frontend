"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Share2,
  Bookmark,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { JobDetail } from "@/types/job-detail"
import { calculateDDay, formatDate } from "@/lib/date-utils"
import { parseContent } from "@/lib/content-parser"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    fetchJobDetail()
  }, [params.id])

  const fetchJobDetail = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data.job)
      } else {
        toast({
          title: "오류",
          description: "채용 공고를 찾을 수 없습니다.",
          variant: "destructive",
        })
        router.push("/jobs")
      }
    } catch (error) {
      console.error("Error fetching job detail:", error)
      toast({
        title: "오류",
        description: "채용 공고를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.post_name,
          text: `${job?.company_name} 채용 공고`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // 링크 복사 fallback
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "링크 복사됨",
        description: "채용 공고 링크가 클립보드에 복사되었습니다.",
      })
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "북마크 해제" : "북마크 추가",
      description: isBookmarked ? "북마크에서 제거되었습니다." : "북마크에 추가되었습니다.",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-10 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div>
                <div className="h-48 bg-gray-200 rounded-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">채용 공고를 찾을 수 없습니다</h1>
          <Button onClick={() => router.push("/jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  const dDayInfo = calculateDDay(job.deadline)
  const getSourceBadgeStyle = (source: string) => {
    switch (source) {
      case "RNDJOB":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "병역일터":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSourceText = (source: string) => {
    switch (source) {
      case "RNDJOB":
        return "이공계인력중개센터"
      case "병역일터":
        return "산업지원 병역일터"
      default:
        return source
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 영역 (좌측 70%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 공고 헤더 */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{job.post_name}</h1>
              <Link href={`/companies/${encodeURIComponent(job.company_name)}`}>
                <h2 className="text-xl md:text-2xl text-primary-600 hover:text-primary-700 font-semibold">
                  {job.company_name}
                </h2>
              </Link>
            </div>

            {/* 핵심 정보 요약 바 */}
            <Card className="border-primary-200 bg-primary-50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-sm font-medium">{job.region}</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
                      {job.field}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-warning-500 mr-2" />
                    <span className={`text-sm font-bold ${dDayInfo.isExpired ? "text-gray-500" : "text-warning-500"}`}>
                      {formatDate(job.deadline)} ({dDayInfo.displayText})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 자격 요건 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">자격 요건 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">학력</p>
                      <p className="font-medium">{job.qualification_education}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">경력</p>
                      <p className="font-medium">{job.qualification_career}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">요원 형태</p>
                      <p className="font-medium">{job.qualification_agent}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 모집 상세 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">모집 상세</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: parseContent(job.keywords_list),
                  }}
                />
              </CardContent>
            </Card>

            {/* 키워드 */}
            {job.keywords && job.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">관련 기술</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="bg-secondary-50 text-secondary-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 영역 (우측 30%) */}
          <div className="space-y-6">
            {/* 지원 정보 박스 */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">지원 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild size="lg" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  <a href={job.source_info} target="_blank" rel="noopener noreferrer">
                    지원하러 가기 🚀
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">마감일</span>
                    <span className={`font-medium ${dDayInfo.isExpired ? "text-gray-500" : "text-warning-500"}`}>
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">등록일</span>
                    <span className="font-medium">{formatDate(job.registration_date)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">출처</span>
                    <Badge variant="outline" className={getSourceBadgeStyle(job.source_type)}>
                      {getSourceText(job.source_type)}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    공유
                  </Button>
                  <Button
                    variant={isBookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={handleBookmark}
                    className="flex-1"
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                    북마크
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 기업 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">기업 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">{job.company_name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold">{job.company_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">전문연구요원 채용 기업</p>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/companies/${encodeURIComponent(job.company_name)}`}>이 기업의 다른 공고 보기</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 지도 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">근무 위치</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-8 mb-3 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">지도 영역</p>
                    <p className="text-xs">(실제 구현 시 지도 API 연동)</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{job.region}</p>
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(job.region)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    지도에서 보기
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
