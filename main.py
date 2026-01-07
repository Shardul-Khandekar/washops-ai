from src.agents.receptionist import receptionist_app

def run_receptionist():

    inputs = [
        "Can you cancel my appointment for tomorrow at 10 AM? My name is Shardul.",
    ]

    state = {"messages": []}

    for user_input in inputs:
        print(f"\nUser: {user_input}")
        # User message needs to be appended to state manually
        state["messages"].append(("user", user_input))
        output = receptionist_app.invoke(state)
        # print(output)
        # update state with new messages
        state["messages"] = output["messages"]
        # Print last agent response
        ai_response = output["messages"][-1].content
        print(f"AI: {ai_response}")

        # The state is kept manually because
        # The reducer tells the graph how to merge updates, without it the AI would overwrite the messages, with reducer it appends them.
        # If we dont want manual state management, add a checkpointer/MemorySaver to the graph.
        # To handle many concurrent users, only thread id passed needs to be changed, since each thread has its own isolated memory.

    # # Define initial state
    # state = {"messages": [("user", "Hi, I am Shardul and I'd like to book a wash for tomorrow.")]}

    # # Run graph
    # output = receptionist_app.invoke(state)

    # # Print last agent response
    # print("AI:", output["messages"][-1].content)

if __name__ == "__main__":
    run_receptionist()


#tool_calls=[{'name': 'cancel_appointment', 'args': {'name': 'Shardul', 'time': '2023-11-24 10:00'}, 'id': 'call_Mxv4GJtvfg07tQHLzs8jgueD', 'type': 'tool_call'}]