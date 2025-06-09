export interface JobDetail {
  id: number
  post_name: string
  company_name: string
  deadline: string
  registration_date: string
  region: string
  field: string
  qualification_agent: string
  qualification_education: string
  qualification_career: string
  keywords_list: string | string[]
  source_info: string
  source_type: string
  thumbnail?: string
  keywords?: string[]
}
