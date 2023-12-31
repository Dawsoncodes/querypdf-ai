# QueryPDF AI

<p align="center">
 <img align="center" src="ui/public/logo.png" width="300" alt="QueryPDF AI">
</p>

## Overview

A simple project that uses the [OpenAI API](https://platform.openai.com/) to answer questions about specific PDF files and summarize their content. It uses the [Langchain](https://github.com/langchain-ai/langchain) library to integrate the OpenAI API with the Chroma vector database and handle queries.

## Requirements

- Docker installed on the system.

## Installation and Setup

- Obtain an OpenAI API key from [OpenAI Platform](https://platform.openai.com/).
- In the backend project directory, run `cp .env.example .env`.
- Add the OpenAI API key to the `.env` file to `OPENAI_API_KEY`.
- Set `CHROMA_HOST` in the `.env` file to `chroma` for container compatibility.
- Run `docker-compose up -d --build` to start the services.

> **Note:** if you are on Windows and get this error `./entrypoint.sh: no such file or directory` consider cloning the repo with the following config

```bash
git clone git@github.com:Dawsoncodes/querypdf-ai.git --config core.autocrlf=false
```

### This setup will initiate three services:

- [Chroma verctor database](https://github.com/chroma-core/chroma) server
- Server (Flask)
- Frontend (Next.js)

## API Endpoints

- **POST /chat**: Engage with the AI assistant. Use the query parameter `file` to specify a particular file.
- **POST /summarize**: Summarize the contents of a file. Use the query parameter `file` to specify the file.
- **GET /\_health**: Checks backend readiness, crucial for the frontend.

## Usage

- After setup, the UI will be accessible for interacting with the AI assistant and summarizing documents.
- Use the API endpoints to interact programmatically with the services.

## Important Notes

If you want to understand a bit about the code and how is it, please read this section.

- [save_embeddings.py](/server/save_embeddings.py)
  This function is used to save the embeddings of the documents in the database. It uses the Chroma vector database to save the embeddings of the documents.

  The function runs only once, when the container is built and the backend server is started, the flask server will not immediately start, it will wait for the embeddings to be saved in the database, due to the large number of documents and response times of the OpenAI API, this process can take a long time, so please be patient.

  The function is handled smartly to only add new documents to the database, so you don't have to worry about duplicate documents even if you shut down the containers in the middle of the process.

  The function uses another function [format_docs.py](/server/data/format_docs.py) to format the documents in a way that is suitable for the Chroma vector database. There is a lot of improvments that can be done to this function, but this is the minimal solution that I could come up with.

  After the [format_docs.py](/server/data/format_docs.py) function is done, the [save_embeddings.py](/server/save_embeddings.py) function will start saving the embeddings in the database.

- **Reset the chroma database**: If you want to reset the chroma database, you can do so by editing the [entrypoint.sh](/server/entrypoint.sh) file and adding `--reset` to the `python3 save_embeddings.py` command, then rebuild the containers using `docker-compose up -d --build`.

  ```bash
  python3 save_embeddings.py --reset
  ```

- [entrypoint.sh](/server/entrypoint.sh)
  This script is used to run the [save_embeddings.py](/server/save_embeddings.py) function and start the flask server, it will do a few things:
  - The chroma server doesn't start right away, it will install some dependencies after the image is built and ran, so the script will continuously check if the chroma server is ready to accept connections. After the chroma server is ready, it will start the [save_embeddings.py](/server/save_embeddings.py) function.
  - After the [save_embeddings.py](/server/save_embeddings.py) function is done, it will start the flask server using gunicon.

## What can be improved?

There are a lot of things that can be improved in this project, but here are some of the most important ones:

- **Improve the formatting of the documents**: The [format_docs.py](/server/data/format_docs.py) function can be improved a lot, when the documents are formatted, you can see in some of the documents contain a lot of unnecessary text and unmeaningful numbers, with a better script, we can remove all of that and only keep the important text.

- **Making the AI bot answer more intelligently**: Currently, the AI bot will only answer the question if it's in the document, but it doesn't understand the context of the question, so if you ask it a question that is not in the document, it will still try to answer it, we can make this better by having multiple models, and use different models based on the question, for example, if the question is about a specific document, we can use the model that is trained on that document, and if the question is about a general topic, we can use a model that is trained on a general topic.

- **Using streaming for better user experience**: Currently, the flask server will wait for the OpenAI API to get back the response, this can take a long time, and the user will have to wait for the response, we can improve this by using streaming, so the user can see the response as soon as it's ready.

- **Dynamic PDF file upload**: Currently, there are only 3 documents which are all a part of the [text_segments.csv](/server/data/text_segments.csv) file, we can improve this by allowing the user to upload their own PDF files and then format them and generate embeddings for them so they can be used by the AI assistant to answer questions and summarize the documents.

- **Improve the summarization**: The summarization takes a lot of time, a better way to do this is to keep it as a background job and notify the user when it's done, and be able to see the same summarization again without having to generated again from scratch.

- **Save embeddings in parallel**: Currently, the embeddings are saved one by one, we can improve this by saving them in parallel, this will reduce the time it takes to save the embeddings.

## License

This project is licensed under the MIT License.
