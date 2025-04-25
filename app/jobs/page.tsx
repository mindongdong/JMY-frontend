"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import JobCard, { type JobType, type JobSource } from "@/components/job-card"
import FilterBar from "@/components/filter-bar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get("keyword") || ""

  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSource, setActiveSource] = useState<"all" | JobSource>("all")
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword)
  const [searchInput, setSearchInput] = useState(initialKeyword)

  useEffect(() => {
    fetchJobs()
  }, [activeSource, searchKeyword])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeSource !== "all") {
        params.append("source", activeSource)
      }
      if (searchKeyword) {
        params.append("keyword", searchKeyword)
      }

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()
      setJobs(data.jobs)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchKeyword(searchInput)
  }

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">전문연구요원 채용 공고</h1>

          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              type="search"
              placeholder="기업·키워드·지역 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </form>

          <Tabs
            defaultValue="all"
            value={activeSource}
            onValueChange={(value) => setActiveSource(value as "all" | JobSource)}
          >
            <TabsList className="mb-6 bg-gray-100 p-1 overflow-x-auto flex w-full justify-start">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="RNDJOB">이공계인력중개센터</TabsTrigger>
              <TabsTrigger value="병역일터">산업지원 병역일터</TabsTrigger>
              <TabsTrigger value="both">복수 출처</TabsTrigger>
            </TabsList>
          </Tabs>

          <FilterBar />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2">공고를 불러오는 중...</span>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  )
}
