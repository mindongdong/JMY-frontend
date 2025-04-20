import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">전문연구요원 포털</h3>
            <p className="text-gray-600 text-sm">
              분산된 전문연구요원 채용 공고를 실시간으로 집약·제공하는 메타 채용 웹앱입니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">유용한 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-primary-600 hover:underline">
                  전문연구요원 제도 FAQ
                </Link>
              </li>
              <li>
                <Link href="/sources" className="text-primary-600 hover:underline">
                  데이터 출처
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-600 hover:underline">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-600 hover:underline">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">오픈소스</h3>
            <div className="flex items-center space-x-2 text-sm">
              <Github className="h-4 w-4" />
              <Link href="https://github.com/username/repo" className="text-primary-600 hover:underline">
                GitHub 저장소
              </Link>
            </div>
            <p className="text-gray-600 text-sm mt-2">MIT 라이선스 하에 공개되어 있습니다.</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} 전문연구요원 포털. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
