"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import JobCard, { type JobType, type JobSource } from "@/components/job-card"
import FilterBar from "@/components/filter-bar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// Select 컴포넌트는 기본 select 태그로 대체
import { Search, Loader2, AlertCircle } from "lucide-react"
// Alert 컴포넌트는 기본 div로 대체

interface ApiResponse {
  jobs: JobType[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  message?: string
  error?: string
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get("keyword") || ""

  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSource, setActiveSource] = useState<"all" | JobSource>("all")
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword)
  const [searchInput, setSearchInput] = useState(initialKeyword)
  const [sortBy, setSortBy] = useState<'recent' | 'deadline' | 'company'>('recent')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)

  useEffect(() => {
    fetchJobs()
  }, [activeSource, searchKeyword, sortBy, currentPage])

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      if (activeSource !== "all") {
        params.append("source", activeSource)
      }
      if (searchKeyword) {
        params.append("keyword", searchKeyword)
      }
      params.append("sortBy", sortBy)
      params.append("page", currentPage.toString())
      params.append("limit", "20")

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data: ApiResponse = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '데이터를 불러오는 중 오류가 발생했습니다.')
      }

      setJobs(data.jobs)
      setTotalPages(data.totalPages)
      setTotalJobs(data.total)
      
      if (data.message) {
        setError(data.message)
      }
      
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchKeyword(searchInput)
    setCurrentPage(1) // 검색 시 첫 페이지로 이동
  }

  const handleSourceChange = (value: string) => {
    setActiveSource(value as "all" | JobSource)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  const handleSortChange = (value: 'recent' | 'deadline' | 'company') => {
    setSortBy(value)
    setCurrentPage(1) // 정렬 변경 시 첫 페이지로 이동
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? "bg-primary-600" : ""}
          >
            {number}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">전문연구요원 채용 공고</h1>

          {/* 검색 및 정렬 영역 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                type="search"
                placeholder="기업·키워드·지역 검색"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </form>
            
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value as 'recent' | 'deadline' | 'company')}
              className="w-[180px] h-10 px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="recent">최신순</option>
              <option value="deadline">마감임박순</option>
              <option value="company">회사명순</option>
            </select>
          </div>

          {/* 출처 필터 탭 */}
          <Tabs
            defaultValue="all"
            value={activeSource}
            onValueChange={handleSourceChange}
          >
            <TabsList className="mb-6 bg-gray-100 p-1 overflow-x-auto flex w-full justify-start">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="RNDJOB">이공계인력중개센터</TabsTrigger>
              <TabsTrigger value="병역일터">산업지원 병역일터</TabsTrigger>
            </TabsList>
          </Tabs>

          <FilterBar />
        </div>

        {/* 검색 결과 정보 */}
        {!loading && (
          <div className="mb-4 text-sm text-gray-600">
            총 {totalJobs.toLocaleString()}개의 채용공고 
            {searchKeyword && ` (검색어: "${searchKeyword}")`}
            {currentPage > 1 && ` - ${currentPage}페이지`}
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2">공고를 불러오는 중...</span>
          </div>
        ) : jobs.length > 0 ? (
          <>
            {/* 채용공고 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            {/* 페이지네이션 */}
            <Pagination />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
            {searchKeyword && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchKeyword("")
                  setSearchInput("")
                  setCurrentPage(1)
                }}
              >
                전체 공고 보기
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}