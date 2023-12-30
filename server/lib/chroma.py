import chromadb
from chromadb.config import Settings
from langchain.vectorstores.chroma import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

CHROMA_HOST = os.getenv("CHROMA_HOST")

client = chromadb.HttpClient(settings=Settings(allow_reset=True),
                             host=CHROMA_HOST if CHROMA_HOST else "localhost",
                             )

chroma_client = Chroma(
    client=client,
    embedding_function=OpenAIEmbeddings(),
)


def get_chroma_db(collection_name: str):
    """
    Get a Chroma instance with a remote database
    """

    return Chroma(
        client=client,
        embedding_function=OpenAIEmbeddings(),
        collection_name=collection_name
    )


def get_chroma_db_local(collection_name: str):
    """
    Get a Chroma instance with a local database
    """

    return Chroma(
        embedding_function=OpenAIEmbeddings(),
        collection_name=collection_name,
        persist_directory="./chroma_db"
    )


def item_exists(collection_name: str, id: str):
    """
    Check if an item exists in the database
    """

    col = client.get_collection(collection_name)

    items = col.get([id])

    return len(items['ids']) > 0


def check_collection_exists(collection_name: str, collection_list):
    """
    Check if a collection exists in the database
    """

    return collection_name in collection_list


def filter_ids_if_exists(collection_name: str, ids: list, collection_list):
    """
    Filter out ids that already exist in the collection
    """

    collection_exists = check_collection_exists(
        collection_name, collection_list)

    if not collection_exists:
        return ids

    items = client.get_collection(collection_name).get(ids)

    return [id for id in ids if id not in items['ids']]
