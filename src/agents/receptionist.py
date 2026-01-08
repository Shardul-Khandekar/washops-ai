from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from src.tools.db_tools import check_availability, book_appointment, cancel_appointment
from src.tools.info_tools import ask_faq
from src.agents.state import ReceptionistState
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

# Setup LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=openai_api_key)
tools = [check_availability, book_appointment, cancel_appointment, ask_faq]
llm_with_tools = llm.bind_tools(tools)

# Define chatbot node
def call_model(state: ReceptionistState):
    messages = state['messages']

    # Get current time for LLM context
    current_time = datetime.now().strftime("%A, %B %d, %Y, %I:%M %p")


    # System prompt
    system_prompt = (
        f"You are a friendly car wash receptionist. Current Time: {current_time}."
        "Use 'ask_faq' to answer questions about pricing, hours, or services. "
        "Use 'check_availability', 'book_appointment', and 'cancel_appointment' for scheduling. "
        "If you don't know the answer, use 'ask_faq' before telling the customer you don't know."

        "### BOOKING PROTOCOL:\n"
        "Before calling 'book_appointment', you MUST collect and verify these 4 pieces of info:\n"
        "1. Service Type (Basic or Full Detail)\n"
        "2. Date & Time (Standardize to YYYY-MM-DD HH:MM)\n"
        "3. Customer Name\n"
        "4. Phone Number\n\n"
        
        "### GUIDELINES:\n"
        "- If the user provides partial info (e.g., 'I want a wash tomorrow'), acknowledge it and ask for the missing slots (e.g., 'What time and what is your name?').\n"
        "- If the user gives you information you didn't ask for yet, acknowledge it and move to the next missing item.\n"
         "- Extract information from the user regardless of the order they provide it.\n"
        "- Once all 4 items are collected, ALWAYS call 'check_availability' once you have a date/time, but BEFORE calling 'book_appointment'.\n"
        "- Do not make up information. If a slot is empty, ask the user."

        "### HANDLING CONFLICTS:\n"
        "- If 'check_availability' shows the user's requested time is taken, DO NOT just say it's unavailable.\n"
        "- Look at the booked slots and suggest the nearest available times (e.g., if 10:00 is taken, suggest 10:30 or 11:00).\n"
        "- Be proactive. The goal is to get a booking, so keep the customer engaged with options."

        "IMPORTANT DATE RULES: "
        "1. All dates passed to tools MUST be in 'YYYY-MM-DD' format. "
        "2. All times passed to tools MUST be in 24-hour 'HH:MM' format. "
        "3. Use the current time provided to resolve relative dates like 'tomorrow' or 'next Tuesday'. "
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