# rag_api.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate



 
# 1. Setup clé API Groq
os.environ["GROQ_API_KEY"] = "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"

# 2. Initialiser LLM Groq
llm = ChatGroq(model_name="llama3-70b-8192")


# 3. Charger les embeddings (même modèle que pour création index)
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# 4. Charger l'index FAISS local avec embeddings
vectorstore = FAISS.load_local("faiss_index", embedding, allow_dangerous_deserialization=True)

# 5. Créer un Retriever avec k réduit à 10 documents
retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# 6. Mémoire conversationnelle avec une fenêtre de 3 derniers échanges
memory = ConversationBufferWindowMemory(k=3, memory_key="chat_history", return_messages=True)

from langchain.prompts import PromptTemplate

template_text = """
Tu es un assistant expert en orientation universitaire à la Faculté des Sciences Dhar Mahraz (FSDM).
Tu réponds aux questions sur les masters, les conditions d'admission, les spécialisations, et tout ce qui concerne les masters de cette faculté.

Ta réponse doit être claire, concise et directe.
Ne mentionne jamais que tu utilises des documents, ni que ta réponse provient d'une recherche.
Répond comme un conseiller expert qui connaît parfaitement les masters de la FSDM.

Contexte:
{context}

Question:
{question}

Réponse :
"""
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=template_text
)

# 8. Construire la chaîne conversationnelle avec retrieval + mémoire + prompt
conv_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    combine_docs_chain_kwargs={"prompt": prompt}
)


# 9. Fonction d'interrogation simplifiée
def ask_question(question: str):
    result = conv_chain.run(question)
    print(f"\n💬 Question : {question}")
    print(f"🧠 Réponse : {result}\n")

# 10. Exemple d'utilisation
if __name__ == "__main__":
    ask_question("Quels sont les masters accessibles ?")
    ask_question("Et les conditions d'admission ?")
    ask_question("Quels masters sont les plus demandés ?")

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