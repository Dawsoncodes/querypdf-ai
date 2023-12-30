import { IconBrandGithub } from "@tabler/icons-react"
import React from "react"

export const Footer = () => {
  return (
    <div className="mt-20 text-center">
      <p>
        Made by{" "}
        <a
          target="_blank"
          className="text-blue-400"
          href="https://x.com/dawsoncodes"
        >
          @DawsonCodes
        </a>
      </p>

      <div className="text-center mt-10 flex flex-col gap-2">
        <p>See source code on </p>
        <a
          target="_blank"
          className="text-blue-400 flex items-center justify-center gap-1"
          href="https://github.com/dawsoncodes/byte-genie"
        >
          <IconBrandGithub />
          GitHub
        </a>
      </div>
    </div>
  )
}
