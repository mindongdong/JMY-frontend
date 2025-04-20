"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

type FilterCategory = {
  name: string
  options: string[]
}

export default function FilterBar() {
  const isMobile = useMobile()
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const filterCategories: FilterCategory[] = [
    { name: "전공", options: ["컴퓨터공학", "전자공학", "기계공학", "화학공학", "생명공학", "물리학"] },
    { name: "지역", options: ["서울", "경기", "인천", "대전", "부산", "대구", "광주", "울산"] },
    { name: "학력", options: ["석사", "박사", "석박사통합"] },
    { name: "복무구분", options: ["현역", "보충역"] },
    { name: "마감기간", options: ["1주일 이내", "2주일 이내", "1개월 이내"] },
  ]

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(option) ? current.filter((item) => item !== option) : [...current, option]

      return {
        ...prev,
        [category]: updated,
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {filterCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <h3 className="text-sm font-medium">{category.name}</h3>
          <div className="flex flex-wrap gap-2">
            {category.options.map((option) => {
              const isSelected = (selectedFilters[category.name] || []).includes(option)
              return (
                <Badge
                  key={option}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer ${isSelected ? "bg-primary-600" : "hover:bg-primary-50"}`}
                  onClick={() => toggleFilter(category.name, option)}
                >
                  {option}
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Badge>
              )
            })}
          </div>
        </div>
      ))}

      {Object.keys(selectedFilters).length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-warning-500 hover:text-warning-600 hover:bg-warning-50"
        >
          필터 초기화
        </Button>
      )}
    </div>
  )

  // Count total selected filters
  const selectedCount = Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0)

  return (
    <div className="mt-8">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                필터
                {selectedCount > 0 && <Badge className="ml-2 bg-primary-600">{selectedCount}</Badge>}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle>필터</SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="bg-white p-4 rounded-10 shadow-sm sticky top-16 z-40">
          <FilterContent />
        </div>
      )}
    </div>
  )
}
