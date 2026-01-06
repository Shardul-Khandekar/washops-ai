from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from src.tools.db_tools import check_availability, book_appointment
from src.agents.state import ReceptionistState
from dotenv import load_dotenv
import os

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

# Setup LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=openai_api_key)
tools = [check_availability, book_appointment]
llm_with_tools = llm.bind_tools(tools)

# Define chatbot node
def call_model(state: ReceptionistState):
    messages = state['messages']
    # System prompt
    system_prompt = (
        "You are a friendly car wash receptionist. Your goal is to help customers "
        "book appointments and answer pricing questions. Always check availability "
        "before confirming a booking."
    )
    response = llm_with_tools.invoke([("system", system_prompt)] + messages)
    # Append response to messages
    return {"messages": [response]}

# Define the state graph
workflow = StateGraph(ReceptionistState)
# Add nodes
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(tools))
# Define workflow edges
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", tools_condition)
workflow.add_edge("tools", "agent")

# Compile the graph
receptionist_app = workflow.compile()