from src.agents.receptionist import receptionist_app

def run_receptionist():
    # Define initial state
    state = {"messages": [("user", "Hi, I am Shardul and I'd like to book a wash for tomorrow.")]}

    # Run graph
    output = receptionist_app.invoke(state)

    # Print last agent response
    print("AI:", output["messages"][-1].content)

if __name__ == "__main__":
    run_receptionist()
