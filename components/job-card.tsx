"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

export type JobSource = "RNDJOB" | "병역일터" | "both"

export type JobType = {
  id: number
  title: string
  company: string
  location: string
  thumbnail: string
  keywords: string[]
  updatedAt: string
  daysLeft: number
  isUrgent?: boolean
  source: JobSource
  url?: string
}

interface JobCardProps {
  job: JobType
}

export default function JobCard({ job }: JobCardProps) {
  // 소스에 따른 배지 색상 설정
  const getSourceBadgeStyle = (source: JobSource) => {
    switch (source) {
      case "RNDJOB":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "병역일터":
        return "bg-green-100 text-green-800 border-green-200"
      case "both":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return ""
    }
  }

  // 소스에 따른 배지 텍스트
  const getSourceText = (source: JobSource) => {
    switch (source) {
      case "RNDJOB":
        return "이공계인력중개센터"
      case "병역일터":
        return "산업지원 병역일터"
      case "both":
        return "복수 출처"
      default:
        return ""
    }
  }

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="w-64 md:w-72 bg-white rounded-10 shadow-sm hover:shadow-lg transition duration-300 h-full cursor-pointer">
        <div className="relative">
          <img
            src={job.thumbnail || "/placeholder.svg"}
            alt={`${job.company} 채용 이미지`}
            className="w-full aspect-video object-cover rounded-t-10"
          />

          {job.isUrgent && (
            <div className="absolute top-0 left-0 right-0">
              <div className="bg-warning-500 text-white text-xs font-medium px-2 py-1 rounded-tl-10 rounded-br-10 inline-block">
                마감임박
              </div>
              <div className="h-1 bg-gray-200 w-full">
                <div className="h-1 bg-warning-500" style={{ width: `${Math.min(100, (7 - job.daysLeft) * 14.3)}%` }} />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex gap-1 mb-2">
            <Badge variant="outline">{job.company}</Badge>
            <Badge>{job.location}</Badge>
          </div>

          <h3 className="text-base font-semibold line-clamp-2 h-12 mb-2">{job.title}</h3>

          <div className="flex flex-wrap gap-1 mb-3">
            {job.keywords.slice(0, 3).map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="bg-secondary-50 text-secondary-700 border-secondary-100">
                {keyword}
              </Badge>
            ))}
          </div>

          {/* 출처 정보 추가 */}
          <div className="mb-3">
            <Badge variant="outline" className={getSourceBadgeStyle(job.source)}>
              {getSourceText(job.source)}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>업데이트 {job.updatedAt}</span>
            </div>
            <div className="flex items-center">
              <span className={job.daysLeft <= 3 ? "text-warning-500 font-medium" : ""}>D-{job.daysLeft}</span>
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary-600 hover:text-primary-700"
                  aria-label="원본 공고 보기"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
