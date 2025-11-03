"""
LangChain service for AI chat functionality
Integrates with Groq (FREE) and ChromaDB
"""
from typing import Optional, Dict, Any
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from chromadb import Client
from chromadb.config import Settings as ChromaSettings
from app.config import settings


class LangChainService:
    """Service for managing AI conversations using LangChain with Groq (FREE)"""
    
    def __init__(self):
        # Initialize Groq LLM (FREE API)
        self.llm = ChatGroq(
            model="llama3-70b-8192",  # Fast and powerful - FREE!
            groq_api_key=settings.groq_api_key,
            temperature=0.7,
            max_tokens=2048
        )
        
        # Initialize conversation memory
        self.memory = ConversationBufferMemory()
        
        # Initialize ChromaDB client
        self.chroma_client = Client(ChromaSettings(
            persist_directory=settings.chroma_db_path,
            anonymized_telemetry=False
        ))
        
        # Create or get collection
        try:
            self.collection = self.chroma_client.get_or_create_collection(
                name="conversations",
                metadata={"description": "Conversation history for RAG"}
            )
        except Exception:
            self.collection = self.chroma_client.create_collection(
                name="conversations"
            )
        
        # Setup conversation chain
        self.setup_chain()
    
    def setup_chain(self):
        """Setup the conversation chain with custom prompt"""
        template = """
        You are a helpful AI assistant for a language learning application.
        You should respond naturally and helpfully to user questions.
        Keep your responses clear, concise, and educational.
        
        Current conversation:
        {history}
        
        Human: {input}
        AI Assistant:
        """
        
        prompt = PromptTemplate(
            input_variables=["history", "input"],
            template=template
        )
        
        self.chain = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            prompt=prompt,
            verbose=False
        )
    
    async def get_response(
        self,
        user_input: str,
        session_id: Optional[str] = None,
        use_rag: bool = False
    ) -> Dict[str, Any]:
        """
        Get AI response for user input
        
        Args:
            user_input: User's message
            session_id: Optional session ID for context
            use_rag: Whether to use RAG with ChromaDB
            
        Returns:
            Dictionary with response and metadata
        """
        try:
            # If RAG is enabled, retrieve relevant context
            context = ""
            if use_rag and self.collection.count() > 0:
                results = self.collection.query(
                    query_texts=[user_input],
                    n_results=3
                )
                if results and results.get("documents"):
                    context = "\n".join(results["documents"][0])
            
            # Add context to input if available
            enhanced_input = user_input
            if context:
                enhanced_input = f"Context: {context}\n\nQuestion: {user_input}"
            
            # Get response from LangChain
            response = await self.chain.apredict(input=enhanced_input)
            
            # Store in ChromaDB for future RAG
            if session_id:
                self.collection.add(
                    documents=[f"User: {user_input}\nAI: {response}"],
                    ids=[f"{session_id}_{self.collection.count()}"],
                    metadatas=[{"session_id": session_id}]
                )
            
            return {
                "response": response,
                "context_used": bool(context),
                "model": "openai/gpt-3.5-turbo"
            }
        
        except Exception as e:
            raise Exception(f"Failed to get AI response: {str(e)}")
    
    def clear_memory(self):
        """Clear conversation memory"""
        self.memory.clear()


# Singleton instance
langchain_service = LangChainService()

