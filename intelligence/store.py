import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from chromadb.config import Settings
import chromadb

class KnowledgeStore:

    def __init__(self):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.client = chromadb.PersistentClient(path="./data")

    def get_collection_name(self, owner_email: str):
        return f"owner_{owner_email.replace('@', '_').replace('.', '_')}"
    
    def sync_wash_data(self, owner_email: str, wash_id: int, documents: list):
        
        collection_name = self.get_collection_name(owner_email)

        # Initilize Chroma
        vector_db = Chroma(
            client=self.client,
            collection_name=collection_name,
            embedding_function=self.embeddings
        )

        # Remove existing documents for the wash_id
        vector_db.delete(where={"wash_id": wash_id})

        # Convert raw data to LangChain Documents
        langchain_docs = [
            Document(
                page_content=doc['content'],
                metadata={**doc['metadata'], "wash_id": wash_id}
            ) for doc in documents
        ]

        if langchain_docs:
            vector_db.add_documents(langchain_docs)
        
        return len(langchain_docs)