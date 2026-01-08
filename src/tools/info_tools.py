from langchain_chroma import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_core.tools import tool
import os
from typing import Annotated

# Initialize vector store
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
persist_directory = "data/chroma_db"

def ingest_docs():
    """
    Reads the MD file and populates the vector store.
    """
    if not os.path.exists("data/knowledge_base.md"):
        return
    
    with open("data/knowledge_base.md", "r") as f:
        text = f.read()
    
    splitter = CharacterTextSplitter(chunk_size=200, chunk_overlap=20)
    docs = splitter.create_documents([text])

    # Create and persist the vector store
    # Both docs and embeddings are stored because embeddings cater similarity search while docs provide the actual content
    # for response generation.
    Chroma.from_documents(docs, embeddings, persist_directory=persist_directory)

@tool
def ask_faq(query: str):
    """
    Search the car wash knowledge base for pricing, hours, and service details.
    """
    db = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    results = db.similarity_search(query, k=1)
    if results:
        return results[0].page_content
    else:
        return "I'm sorry, I don't have information on that. Would you like to speak to a manager?"
    
@tool
def handoff_to_manager(reason: Annotated[str, "The specific reason why a human manager is needed (e.g., damage claim, extreme frustration)"]):
    """
    Escalates the call to a human manager. Use this ONLY if:
    1. The user is reporting damage to their vehicle.
    2. The user is extremely angry or using profanity.
    3. The user has a complex request that the current tools cannot handle.
    """
    print(f"\n[SYSTEM ALERT] Handoff Triggered. Reason: {reason}")
    return f"I have alerted my manager regarding: '{reason}'. A human will take over this call immediately. Please stay on the line."
    
if __name__ == "__main__":
    # Run ingestion once
    ingest_docs()
    print("Knowledge base ingested into vector store.")