# rag_api.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain

# 1. Setup clé API Groq
os.environ["GROQ_API_KEY"] = "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"

# 2. Initialiser LLM Groq
llm = ChatGroq(model_name="llama3-70b-8192")

# 3. Charger embeddings
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# 4. Charger l'index FAISS local
vectorstore = FAISS.load_local("faiss_index", embedding, allow_dangerous_deserialization=True)

# 5. Création du retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# 6. Mémoire conversationnelle
memory = ConversationBufferWindowMemory(k=3, memory_key="chat_history", return_messages=True)

# 7. Chaîne conversationnelle
conv_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory
)
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# --- Configuration CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # à restreindre en prod (ex: ["https://ton-frontend.vercel.app"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schéma de requête ---
class QueryRequest(BaseModel):
    question: str

# --- Endpoint RAG ---
@app.post("/query")
def ask_question_api(request: QueryRequest):
    answer = conv_chain.run(request.question)
    return {"answer": answer}