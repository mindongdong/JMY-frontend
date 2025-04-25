import Header from "@/components/header"
import Hero from "@/components/hero"
import LatestJobs from "@/components/sections/latest-jobs"
import ClosingSoon from "@/components/sections/closing-soon"
import ThemeTabs from "@/components/sections/theme-tabs"
import ByRegion from "@/components/sections/by-region"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-20">
        <div className="mt-8 space-y-16">
          <LatestJobs />
          <ClosingSoon />
          <ThemeTabs />
          <ByRegion />
        </div>
      </div>
      <Footer />
    </main>
  )
}
