from flask import Flask, render_template, request, redirect, url_for, session
import os
import requests
import ell
from ell import assistant, tool, Message, user, system, complex, simple
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# Load environment variables
load_dotenv()

# Initialize Ell
ell.init()


# Define the search tool
@tool()
def search_web(query: str):
    """Search the web for the given query and return the top results with URLs."""
    api_key = os.environ.get("SERPAPI_API_KEY")

    search_url = "https://serpapi.com/search"
    params = {
        "engine": "google",
        "q": query,
        "api_key": api_key,
        "num": 20,  # Number of results to fetch
    }

    response = requests.get(search_url, params=params)
    response.raise_for_status()
    data = response.json()

    if "error" in data:
        raise ValueError(f"SerpAPI Error: {data['error']}")

    # Extract search results
    results = []
    for res in data.get("organic_results", []):
        title = res.get("title", "")
        link = res.get("link", "")
        snippet = res.get("snippet", "")
        citation = f"{title} ({link}): {snippet}"
        results.append(citation)

    # Return the results as a single string
    return "\n".join(results)


# Define the view_url tool
@tool()
def view_url(url: str) -> str:
    """Fetches the content of a given URL and returns its cleaned text content."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        # Extract text while removing unwanted elements
        blacklist = ["script", "style", "head", "meta", "noscript"]
        text = ""

        for element in soup.find_all(string=True):
            if element.parent.name not in blacklist:
                text += element.strip() + " "

        summary = summarize_text(text)
        return summary
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
        return f"Error fetching URL {url}: {e}"


@simple(model="gpt-4o")
def summarize_text(text: str):
    return [user(f"Please give a detailed summary of the following text:\n\n{text}")]


# Define the assistant with tool usage
@complex(model="gpt-4o", tools=[search_web, view_url])
def answer_question(message_history: list[Message] = []):
    return [
        system(
            "You are a helpful assistant that answers questions using web search results and can view specific URLs to provide detailed and cited answers. When you need information, use the search_web or view_url tools as appropriate before responding. Utilize high quality sources of information. Today is November 12, 2024. Include citations in the final answer."
        ),
    ] + message_history


# Run the assistant conversation
def run_assistant_conversation(question: str) -> str:
    """Handles the conversation with the assistant, including executing tool calls."""
    try:
        message_history = []
        message_history.append(user("User Question: " + question))
        response = answer_question(message_history)
        message_history.append(response)

        while response.tool_calls:
            for tool_call in response.tool_calls:
                print(tool_call)
            tool_results = response.call_tools_and_collect_as_message(
                parallel=True, max_workers=10
            )
            message_history.append(tool_results)
            response = answer_question(message_history)
            message_history.append(response)

        return response.text.strip()

    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, there was an error processing your request. Please try again."


# Set up Flask app
app = Flask(__name__)
app.secret_key = "your-secure-secret-key"  # Replace with a secure, random key


# Flask routes
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        question = request.form["question"]
        try:
            # Run the assistant conversation
            answer = run_assistant_conversation(question)

            # Store the answer in the session
            session["answer"] = answer

        except Exception as e:
            session["answer"] = (
                "Sorry, an error occurred while processing your question. Please try again later."
            )

        return redirect(url_for("index"))

    else:
        # GET request
        answer = session.pop("answer", None)
        return render_template("index.html", answer=answer)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
