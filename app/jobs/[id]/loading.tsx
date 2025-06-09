export default function Loading() {
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
