import unittest
from src.tools.info_tools import ingest_docs, ask_faq

class TestRAG(unittest.TestCase):
    def test_faq_retrieval(self):
        # Ensure the knowledge base is ingested
        ingest_docs()

        response = ask_faq.invoke({"query": "How much for a full detail?"})
        self.assertIn("$150", response)
        print(f"RAG Response: {response}")

if __name__ == "__main__":
    unittest.main()