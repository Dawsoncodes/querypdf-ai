import { FileNames } from "./files"

export type DefaultQuestion = {
  id: number
  question: string
}

export const defaultQuestions: {
  [key in FileNames]: DefaultQuestion[]
} = {
  "dairy-farm_ar2020pdf": [
    {
      id: 1,
      question: "How does the Group define and recognize a subsidiary?",
    },
    {
      id: 2,
      question:
        "Who succeeded Ben Keswick as Managing Director on June 15, 2020?",
    },
    {
      id: 4,
      question:
        "What were the main challenges faced by 7-Eleven South China in 2020?",
    },
    {
      id: 5,
      question:
        "Provide the address and contact details for DFI Lucky Private Limited in Cambodia.",
    },
  ],
  "shell-tax-contribution-report-2020pdf": [
    {
      id: 1,
      question:
        "What are the four goals of Shell's Powering Progress strategy?",
    },
    {
      id: 2,
      question:
        "How does Powering Progress aim to create value for shareholders and society?",
    },
    {
      id: 3,
      question:
        "What are Shell's core values underpinning its focus on safety?",
    },
    {
      id: 4,
      question:
        "Can you describe the Pennsylvania Resource Manufacturing Tax Credit and its criteria?",
    },
    {
      id: 5,
      question:
        "How does the Keystone Opportunity Zone tax incentive work and how has Shell benefited from it?",
    },
  ],
  "with-highlights-comments-barclays-country-snapshot-2021pdf": [
    {
      id: 1,
      question:
        "How does Barclays define its purpose and how does this influence its strategy?",
    },
    {
      id: 2,
      question:
        "What are some examples of tax incentives Barclays invests in to support policy objectives?",
    },
    {
      id: 3,
      question:
        "How does Barclays' investment in renewable energy and clean technology support the transition to a low-carbon economy?",
    },
    {
      id: 4,
      question:
        "Can you describe how Barclays supported the expansion of the Giggling Squid restaurant group?",
    },
    {
      id: 5,
      question:
        "What key reports and disclosures does Barclays PLC provide to offer insight into its performance and strategies?",
    },
  ],
}
