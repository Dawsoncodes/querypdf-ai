"use client"
import { Container } from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { FormEventHandler, useState } from "react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { files } from "@/data/files"
import { defaultQuestions } from "@/data/defaultQuestions"
import { DefaultQuestion } from "@/components/DefaultQuestion"
import { cn } from "@/lib/utils"

type Message = {
  from: "user" | "assistant"
  text: string
}

type Response = {
  message: string
}

const defaultMessages: Message[] = []

export default function Home() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>(defaultMessages)

  const searchParams = useSearchParams()

  const fileId = searchParams.get("file") as (typeof files)[number]["id"]

  const { mutateAsync: runChat, isPending: chatIsPending } = useMutation({
    mutationKey: ["send", text, fileId],
    mutationFn: (messages: Message[]) =>
      client
        .post<Response>(`/chat?file=${fileId}`, { messages })
        .then((r) => r.data),
  })

  const {
    mutateAsync: getSummary,
    isPending: summaryIsPending,
    data: summary,
  } = useMutation({
    mutationKey: ["summary", fileId],
    mutationFn: () =>
      client
        .post<{ summary: string }>("/summarize", { file: fileId })
        .then((r) => r.data),
  })

  const getSummaryHandler = async () => {
    const toastId = toast.loading("Generating summary...")

    getSummary()
      .then(() => {
        toast.success("Summary generated", { id: toastId })
      })
      .catch(() => {
        toast.error("Error generating summary", { id: toastId })
      })
  }

  const submitChatHandler: FormEventHandler = async (e) => {
    e.preventDefault()

    const userMessage: Message = {
      from: "user",
      text,
    }

    await runChat([...messages, userMessage])
      .then((r) => {
        setMessages([
          ...messages,
          userMessage,
          {
            from: "assistant",
            text: r.message,
          },
        ])

        setText("")
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || e.message)
      })
  }

  const onDefaultQuestionClick = (question: string) => {
    if (chatIsPending) return

    const userMessage: Message = {
      from: "user",
      text: question,
    }

    runChat([...messages, userMessage])
      .then((r) => {
        setMessages([
          ...messages,
          userMessage,
          {
            from: "assistant",
            text: r.message,
          },
        ])

        setText("")
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || e.message)
      })
  }

  const fileExists = files
    .map((file) => file.id as string)
    .includes(fileId?.toString() || "")

  if (!fileId || !fileExists) {
    return (
      <Container>
        <h2>Please select a file</h2>

        <Link
          href={"/"}
          className="flex items-center gap-2 my-5 bg-slate-700 w-max p-2 rounded-lg hover:bg-slate-600"
        >
          <IconArrowLeft />
          <p>Go back</p>
        </Link>
      </Container>
    )
  }

  const file = files.find((file) => file.id === fileId)

  return (
    <Container className="bg-slate-900 min-h-screen">
      <Link
        href={"/"}
        className="flex items-center gap-2 my-5 w-max p-2 rounded-lg text-sm hover:opacity-70"
      >
        <IconArrowLeft />
        <p>Go back</p>
      </Link>

      <h1 className="text-white text-3xl mt-20">
        Searching: <strong>{file?.name}</strong>
      </h1>

      {/* Chat */}
      <div className="my-5">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex my-2 ${
              message.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                message.from === "user" ? "bg-blue-500" : "bg-gray-800"
              } p-2 px-3 rounded-lg`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-between items-stretch my-2">
        {defaultQuestions[fileId].slice(0, 4).map(({ id, question }) => (
          <DefaultQuestion
            onClick={() => onDefaultQuestionClick(question)}
            key={id}
            question={question}
            className={cn({
              "cursor-default": chatIsPending,
            })}
          />
        ))}
      </div>

      {/* Input and button */}
      <form
        onSubmit={submitChatHandler}
        className="flex items-center justify-between gap-2"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
          disabled={chatIsPending}
        />
        <Button disabled={chatIsPending} type="submit">
          Send
        </Button>
      </form>

      <Button
        disabled={summaryIsPending}
        onClick={getSummaryHandler}
        className="mt-5"
      >
        {summaryIsPending ? (
          <div className="flex gap-5 items-center justify-between">
            <p>Generating summary</p>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          "Summarize Document"
        )}
      </Button>

      {summaryIsPending && (
        <p className="text-teal-500 my-2">
          <small>This may take a while, please wait...</small>
        </p>
      )}

      {summary && (
        <div className="mt-10">
          <h2>
            Summary for <span className="text-blue-500">{fileId}</span>
          </h2>

          <p className="mt-4">{summary.summary}</p>
        </div>
      )}
    </Container>
  )
}
