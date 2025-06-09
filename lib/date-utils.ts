export function calculateDDay(deadline: string): { dDay: number; isExpired: boolean; displayText: string } {
  const today = new Date()
  const deadlineDate = new Date(deadline)

  // 시간을 00:00:00으로 설정하여 날짜만 비교
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)

  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const isExpired = diffDays < 0

  let displayText = ""
  if (diffDays === 0) {
    displayText = "오늘 마감"
  } else if (diffDays > 0) {
    displayText = `D-${diffDays}`
  } else {
    displayText = "마감"
  }

  return {
    dDay: diffDays,
    isExpired,
    displayText,
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, ".")
    .replace(/\s/g, "")
}
