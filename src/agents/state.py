from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages

class ReceptionistState(TypedDict):

    # add_message is a reducer that appends new messages to the messages list(AI or human messages)
    messages: Annotated[list, add_messages]

    # Fields to track slots
    customer_name: str
    vehicle_type: str