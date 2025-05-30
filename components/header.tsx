"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/jobs?keyword=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-6 lg:px-8",
        isScrolled ? "bg-white shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex items-center gap-4">
        <div className="flex-shrink-0">
          <Link href="/">
            <h1 className="text-xl font-bold text-primary-600">
              <span className="hidden md:inline">전문연구요원</span>
              <span className="md:hidden">전문연</span>
            </h1>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="기업·키워드·지역 검색"
            className="pl-10 w-full h-10 rounded-8 border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div className="flex-shrink-0 hidden md:block">
          <Link href="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
            전체 공고
          </Link>
        </div>
      </div>
    </header>
  )
}
