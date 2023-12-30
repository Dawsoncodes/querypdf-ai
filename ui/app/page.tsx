import { Container } from "@/components/Container"
import { cn } from "@/lib/utils"
import { FC, HTMLAttributes } from "react"
import { IconFile } from "@tabler/icons-react"
import Link from "next/link"
import { type FileItem, files } from "@/data/files"
import Image from "next/image"

const Home = () => {
  return (
    <Container className="flex flex-col items-center">
      <h1 className="text-2xl font-semibold">QueryPDF AI</h1>

      <Image
        src="/logo.png"
        height={200}
        width={200}
        alt="QueryPDF AI"
        className="my-4 rounded-full"
      />

      <div className="mt-10 w-full max-w-sm">
        <p className="text-center">
          Please select a file you want to get answers from
        </p>

        <div className="flex flex-col gap-1 mt-4">
          {files.map((file) => (
            <FileItem file={file} key={file.id} />
          ))}
        </div>
      </div>
    </Container>
  )
}

interface FileItemProps extends HTMLAttributes<HTMLDivElement> {
  file: FileItem
}

const FileItem: FC<FileItemProps> = ({ file, className, ...props }) => {
  return (
    <Link href={`/chat?file=${file.id}`}>
      <div
        className={cn(
          "bg-slate-800 hover:bg-slate-700 p-4 rounded-lg w-full",
          className
        )}
        {...props}
      >
        <div className="flex gap-2 items-center">
          <IconFile />
          {file.name}
        </div>
      </div>
    </Link>
  )
}

export default Home
