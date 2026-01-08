from src.agents.receptionist import receptionist_app

def test_chaos_booking():
    
    history = []

    print("---- Test: Chaos Booking ----")

    # Simulate a chaotic booking conversation
    user_msg = "I want to book a wash for tomorrow at 3 PM."
    history.append(("user", user_msg))
    output = receptionist_app.invoke({"messages": history})
    history.append(output["messages"][-1])
    print(f"AI: {output['messages'][-1].content}")

    # Agent can ask any of the missing info in any order
    # User might or might not response with something ELSE entirely
    user_msg = "My phone number is 123-456-7890."
    history.append(("user", user_msg))
    output = receptionist_app.invoke({"messages": history})
    history.append(output["messages"][-1])
    print(f"AI: {output['messages'][-1].content}")

    # Giveuser_msg = "It's for Shardul and I want a Full Detail."
    user_msg = "It's for Sam and I want a Full Detail."
    history.append(("user", user_msg))
    output = receptionist_app.invoke({"messages": history})
    print(f"AI: {output['messages'][-1].content}")

def test_conflict_resolution():

    history = []
    # Simulate a chaotic booking conversation
    user_msg = "I want to book a wash for tomorrow at 3 PM."
    history.append(("user", user_msg))
    output = receptionist_app.invoke({"messages": history})
    history.append(output["messages"][-1])
    print(f"AI: {output['messages'][-1].content}")

    # Agent can ask any of the missing info in any order
    # User might or might not response with something ELSE entirely
    user_msg = "My phone number is 123-456-7890."
    history.append(("user", user_msg))
    output = receptionist_app.invoke({"messages": history})
    history.append(output["messages"][-1])
    print(f"AI: {output['messages'][-1].content}")

    # Giveuser_msg = "It's for Shardul and I want a Full Detail."
    user_msg = "It's for Shardul and I want a Basic service."
    history.append(("user", user_msg))
    output = receptionist_app.invoke({"messages": history})
    print(f"AI: {output['messages'][-1].content}")


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
    # run_receptionist()
    # test_chaos_booking()
    test_conflict_resolution()


#tool_calls=[{'name': 'cancel_appointment', 'args': {'name': 'Shardul', 'time': '2023-11-24 10:00'}, 'id': 'call_Mxv4GJtvfg07tQHLzs8jgueD', 'type': 'tool_call'}]