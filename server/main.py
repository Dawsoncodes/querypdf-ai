from flask import Flask, request
from flask_cors import CORS
from langchain.llms.openai import OpenAI
from lib.chroma import get_chroma_db
from langchain.schema import HumanMessage, SystemMessage
from langchain.chat_models.openai import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from summarize import summarize
from data.get_collections import get_collections


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

collections = get_collections()

chat = ChatOpenAI()


def get_agent(collection_name: str):
    """
    Gets a question answering agent based on the collection name.

    :param collection_name: The name of the collection to use
    """

    db = get_chroma_db(collection_name=collection_name)

    memory = ConversationBufferMemory(
        memory_key="chat_history", return_messages=True)

    qa = ConversationalRetrievalChain.from_llm(
        OpenAI(temperature=0), db.as_retriever(), memory=memory
    )

    return qa


@app.route("/chat", methods=["POST"])
def chat_route():
    """
    Chat route to interact with the chatbot
    """

    try:
        file_param = request.args.get('file')

        if not file_param or type(file_param) != str:
            return "Bad request", 400

        data = request.get_json()

        messages = data.get('messages', None)

        formatted_messages = []
        for message in messages:
            if message['from'] == "user":
                formatted_messages.append(
                    HumanMessage(content=message['text']))
            else:
                formatted_messages.append(
                    SystemMessage(content=message['text']))

        final_message = messages[-1]['text']

        chat_history = formatted_messages[:-1]

        input_keys = {
            "question": final_message,
            "chat_history": chat_history
        }

        qa = get_agent(file_param)

        response = qa(input_keys)

        return {
            "message": response['answer']
        }
    except Exception as e:
        print("err", e)
        return "Bad request", 400


@app.route("/summarize", methods=["POST"])
def summarize_route():
    """
    Summarize route to summarize a document
    """

    try:
        data = request.get_json()

        filename = data.get('file', None)

        if not filename:
            return "Bad request", 400

        if filename not in collections:
            return "File not found", 404

        summary = summarize(filename)

        return {
            "summary": summary
        }
    except Exception as e:
        print("err", e)
        return {"message": "Bad request"}, 400


@app.route("/_health", methods=["GET"])
def health_route():
    """
    Health route to check if the server is running.

    This is important for the frontend.
    """

    return {"message": "ok"}, 200


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
