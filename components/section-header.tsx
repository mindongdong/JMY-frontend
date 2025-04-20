import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  href: string
  variant?: "default" | "warning"
}

export default function SectionHeader({ title, href, variant = "default" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className={`text-2xl font-bold ${variant === "warning" ? "text-warning-500" : "text-gray-900"}`}>{title}</h2>
      <Link
        href={href}
        className={`flex items-center text-sm font-medium ${
          variant === "warning" ? "text-warning-500 hover:text-warning-600" : "text-primary-600 hover:text-primary-700"
        }`}
      >
        더보기 <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  )
}
