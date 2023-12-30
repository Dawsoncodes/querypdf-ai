import { cn } from "@/lib/utils"
import { FC, HTMLAttributes } from "react"
import { Card, CardContent } from "./ui/card"

export interface DefaultQuestionProps extends HTMLAttributes<HTMLDivElement> {
  question: string
}

export const DefaultQuestion: FC<DefaultQuestionProps> = ({
  className,
  question,
  ...props
}) => {
  return (
    <Card
      className={cn("hover:bg-slate-900 cursor-pointer", className)}
      {...props}
    >
      <CardContent className="py-4 text-sm text-center flex justify-center items-center h-full">
        {question}
      </CardContent>
    </Card>
  )
}
