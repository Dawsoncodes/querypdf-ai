export const files = [
  {
    id: "dairy-farm_ar2020pdf",
    name: "Daity Farm",
  },
  {
    id: "with-highlights-comments-barclays-country-snapshot-2021pdf",
    name: "Barclays",
  },
  {
    id: "shell-tax-contribution-report-2020pdf",
    name: "Shell",
  },
] as const

export type FileNames = (typeof files)[number]["id"]

export type FileItem = (typeof files)[number]
