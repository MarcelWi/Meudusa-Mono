const SkeletonCodeForm = () => {
  return (
    <div className="w-full flex flex-col" role="status" aria-label="Loading discount code form">
      <div className="bg-gray-100 h-7 w-24 mb-4 rounded animate-pulse"></div>
      <div className="grid grid-cols-[1fr_80px] gap-x-2">
        <div className="bg-gray-100 h-12 rounded animate-pulse"></div>
        <div className="bg-gray-100 h-12 rounded animate-pulse"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default SkeletonCodeForm
