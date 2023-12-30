import { cn } from "@/lib/utils"
import { FC, HTMLAttributes } from "react"

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const Container: FC<ContainerProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("p-10 w-full max-w-6xl mx-auto", className)}
      {...props}
    />
  )
}
