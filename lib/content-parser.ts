export function parseContent(content: string | string[]): string {
  let parsedContent = ""

  if (Array.isArray(content)) {
    parsedContent = content.join("\n")
  } else if (typeof content === "string") {
    // 문자열화된 배열 형태인지 확인
    if (content.startsWith("[") && content.endsWith("]")) {
      try {
        const parsed = JSON.parse(content.replace(/'/g, '"'))
        if (Array.isArray(parsed)) {
          parsedContent = parsed.join("\n")
        } else {
          parsedContent = content
        }
      } catch {
        parsedContent = content
      }
    } else {
      parsedContent = content
    }
  }

  // 줄바꿈을 <br>로 변환
  parsedContent = parsedContent.replace(/\n/g, "<br>")

  // URL을 링크로 변환
  const urlRegex = /(https?:\/\/[^\s]+)/g
  parsedContent = parsedContent.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:underline">$1</a>',
  )

  // 목록 형태 처리 (- 또는 숫자. 로 시작하는 줄)
  const lines = parsedContent.split("<br>")
  const processedLines = lines.map((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine.match(/^[-•]\s/)) {
      return `<li class="ml-4">${trimmedLine.substring(2)}</li>`
    } else if (trimmedLine.match(/^\d+\.\s/)) {
      return `<li class="ml-4">${trimmedLine.replace(/^\d+\.\s/, "")}</li>`
    }
    return line
  })

  return processedLines.join("<br>")
}
