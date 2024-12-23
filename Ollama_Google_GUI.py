#!/usr/bin/env python3

import tkinter as tk
from tkinter import ttk
import threading
import subprocess
import sys
import os
import time

# Attempt to install requests if missing
try:
    import requests
except ImportError:
    print("`requests` not found. Attempting to install it via pip...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests


###############################################################################
# 1. Configuration
###############################################################################
# For demonstration purposes, these are placeholders; replace with your own!
API_KEY = os.environ.get("GOOGLE_API_KEY", "AIzaSyC7OXth77ZDaoCpshPMdjOqQpK9D6xcE3M")
CSE_ID = os.environ.get("GOOGLE_CSE_ID", "63063bff686d34a72")

OLLAMA_COMMAND = "ollama"     # or full path to the ollama binary
OLLAMA_MODEL_NAME = "qwen2.5" # local model name for `ollama run qwen2.5`


###############################################################################
# 2. Google Search Client
###############################################################################
class GoogleSearchClient:
    """
    Encapsulates queries to Google Custom Search and result summarization.
    """
    def __init__(self, api_key, cse_id):
        self.api_key = api_key
        self.cse_id = cse_id
        self.search_url = "https://www.googleapis.com/customsearch/v1"

    def search(self, query):
        """
        Perform a Google Custom Search and return raw results or an error string.
        """
        if ("YOUR_GOOGLE_API_KEY" in self.api_key) or ("YOUR_CSE_ID" in self.cse_id):
            return "Error: Google Custom Search credentials are not set."

        params = {
            "key": self.api_key,
            "cx":  self.cse_id,
            "q":   query
        }
        try:
            resp = requests.get(self.search_url, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            return data.get("items", [])
        except requests.exceptions.HTTPError as http_err:
            return f"Error: HTTP Error during Google Search: {http_err}"
        except Exception as e:
            return f"Error: Exception during Google Search: {e}"

    def summarize_results(self, results):
        """
        Format search results into a readable string.
        If results is an error string, return that directly.
        """
        if isinstance(results, str):
            # It's an error message
            return results

        if not results:
            return "No results found."

        summary_lines = []
        for idx, item in enumerate(results, start=1):
            title = item.get("title", "No Title")
            link = item.get("link", "No Link")
            snippet = item.get("snippet", "No Snippet")
            summary_lines.append(f"{idx}. Title: {title}\n   Link: {link}\n   Snippet: {snippet}\n")
        return "\n".join(summary_lines)


###############################################################################
# 3. Local LLM Client (Ollama via Subprocess)
###############################################################################
class LocalLLMClient:
    """
    Calls `ollama run <model_name>` as a subprocess, sending the prompt via stdin.
    """
    def __init__(self, command, model_name):
        self.command = command
        self.model_name = model_name

    def run_inference(self, prompt):
        """
        Subprocess-based LLM inference. Returns the output text or an error string.
        """
        cmd = [self.command, "run", self.model_name]

        try:
            result = subprocess.run(
                cmd,
                input=prompt,
                text=True,
                capture_output=True,
                timeout=120  # Adjust as needed for longer prompts
            )
            if result.returncode != 0:
                return f"[Error] Ollama returned code {result.returncode}:\n{result.stderr.strip()}"
            return result.stdout.strip()
        except FileNotFoundError:
            return ("[Error] `ollama` binary not found. "
                    "Please ensure Ollama is installed and the path is correct.")
        except Exception as e:
            return f"[Error] Exception calling Ollama: {e}"


###############################################################################
# 4. Tkinter GUI with Enhanced Features
###############################################################################
class AppGUI:
    def __init__(self, root, google_client, llm_client):
        self.root = root
        self.google_client = google_client
        self.llm_client = llm_client
        self.conversation_history = []  # store (role, text) for multi-turn chat

        self.root.title("Boldly Creative Chat + Search App")

        ##############################
        # UI SETUP
        ##############################

        # Top Frame: Query + Mode + Buttons
        top_frame = tk.Frame(self.root)
        top_frame.pack(padx=10, pady=5, fill=tk.X)

        # User input label
        tk.Label(top_frame, text="Enter your query:").pack(side=tk.LEFT)

        # User input entry
        self.query_var = tk.StringVar()
        self.entry_query = tk.Entry(top_frame, textvariable=self.query_var, width=50)
        self.entry_query.pack(side=tk.LEFT, padx=5)

        # Mode selection (Drop-down for "LLM only" or "LLM + Web Search")
        self.mode_var = tk.StringVar(value="Search + LLM")
        self.mode_dropdown = ttk.Combobox(top_frame, textvariable=self.mode_var, width=18,
                                          values=["Search + LLM", "LLM Only"])
        self.mode_dropdown.pack(side=tk.LEFT, padx=5)

        # Buttons frame
        btn_frame = tk.Frame(self.root)
        btn_frame.pack(padx=10, pady=5)

        # "Send" button
        self.btn_send = tk.Button(btn_frame, text="Send", command=self.on_send)
        self.btn_send.pack(side=tk.LEFT, padx=5)

        # "Clear Chat" button
        self.btn_clear_chat = tk.Button(btn_frame, text="Clear Chat", command=self.on_clear_chat)
        self.btn_clear_chat.pack(side=tk.LEFT, padx=5)

        # Status label
        self.status_var = tk.StringVar(value="Idle")
        self.status_label = tk.Label(self.root, textvariable=self.status_var, fg="blue")
        self.status_label.pack(pady=5)

        # Middle Frame: Conversation Display
        conv_frame = tk.Frame(self.root)
        conv_frame.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)

        # A Text widget to show the conversation (multi-turn)
        self.conv_box = tk.Text(conv_frame, wrap=tk.WORD, width=80, height=20)
        self.conv_box.pack(side=tk.LEFT, padx=5, pady=5, fill=tk.BOTH, expand=True)

        # Scrollbar for the conversation box
        scrollbar = tk.Scrollbar(conv_frame, command=self.conv_box.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.conv_box.config(yscrollcommand=scrollbar.set)

    ############################################################################
    # 4a. Main Button Event: on_send
    ############################################################################
    def on_send(self):
        """
        Called when the user clicks 'Send' to query either:
         - LLM only, or
         - LLM + Google search, depending on the selected mode.
        """
        query_text = self.query_var.get().strip()
        if not query_text:
            self._append_message("system", "Please enter a query first.\n", "red")
            return

        # Add user's message to the conversation
        self.conversation_history.append(("user", query_text))

        # Show the user's message in the conversation box
        self._append_message("user", f"User: {query_text}\n", "blue")

        # Clear the entry
        self.query_var.set("")

        # Determine selected mode
        selected_mode = self.mode_var.get()
        self._set_status(f"Processing [{selected_mode}] ...")

        # Disable the Send button to prevent multiple concurrent tasks
        self.btn_send.config(state=tk.DISABLED)
        self.btn_clear_chat.config(state=tk.DISABLED)

        # Start background work
        if selected_mode == "Search + LLM":
            thread = threading.Thread(target=self._search_and_respond, args=(query_text,))
        else:  # "LLM Only"
            thread = threading.Thread(target=self._just_llm_respond, args=(query_text,))
        thread.start()

    ############################################################################
    # 4b. Clear Chat History
    ############################################################################
    def on_clear_chat(self):
        """
        Clears the conversation history and the conversation box.
        """
        self.conversation_history.clear()
        self.conv_box.delete("1.0", tk.END)
        self._append_message("system", "Conversation cleared.\n", "green")

    ############################################################################
    # 4c. Worker Methods (Threads)
    ############################################################################
    def _search_and_respond(self, user_query):
        """
        Worker method: performs a Google search and uses the local LLM to respond.
        """
        # Step 1: Google Search
        results = self.google_client.search(user_query)
        summary = self.google_client.summarize_results(results)

        # If an error occurred, show it in conversation
        if "Error" in summary:
            self._append_message("system", summary + "\n", "red")
            self._finish_task()
            return

        # Step 2: Build prompt with conversation memory + search data
        # We'll take the entire conversation history, then append the fresh search summary
        conversation_text = self._build_conversation_text()
        prompt = (
            f"{conversation_text}\n\n"
            f"Search results:\n{summary}\n\n"
            "Please provide a concise, helpful answer using all of the above context. "
            "If the search data is insufficient, reason or speculate carefully."
        )

        # Step 3: Call the LLM
        response = self.llm_client.run_inference(prompt)

        # Step 4: Append AI response to conversation
        self.conversation_history.append(("assistant", response))
        self._append_message("assistant", f"Assistant: {response}\n", "brown")

        # Finish up
        self._finish_task()

    def _just_llm_respond(self, user_query):
        """
        Worker method: uses only local LLM (no web search).
        """
        # Build prompt from entire conversation, ignoring search
        conversation_text = self._build_conversation_text()
        prompt = (
            f"{conversation_text}\n\n"
            "Please respond to the user's latest query using only the conversation context."
        )

        response = self.llm_client.run_inference(prompt)

        self.conversation_history.append(("assistant", response))
        self._append_message("assistant", f"Assistant: {response}\n", "brown")

        self._finish_task()

    ############################################################################
    # 4d. Helper Methods
    ############################################################################
    def _finish_task(self):
        """
        Re-enable buttons and reset status after a background thread finishes.
        """
        self._set_status("Idle")
        self.btn_send.config(state=tk.NORMAL)
        self.btn_clear_chat.config(state=tk.NORMAL)

    def _build_conversation_text(self):
        """
        Convert the entire conversation_history into a text block
        that can be passed as a prompt to the LLM.
        Format:
          - user or assistant roles with text.
        """
        lines = []
        for (role, content) in self.conversation_history:
            if role == "user":
                lines.append(f"User: {content}")
            elif role == "assistant":
                lines.append(f"Assistant: {content}")
            else:
                # system or other roles
                lines.append(f"{role.capitalize()}: {content}")
        return "\n".join(lines)

    def _append_message(self, role, message, color="black"):
        """
        Insert message into the conversation Text widget with a specified color.
        """
        def _do():
            self.conv_box.insert(tk.END, message, role)
            self.conv_box.insert(tk.END, "\n", role)
            self.conv_box.see(tk.END)
            # Apply tag config for color
            self.conv_box.tag_config(role, foreground=color, font=("Helvetica", 10, "italic"))

        self.root.after(0, _do)

    def _set_status(self, msg):
        """
        Safely update the status label text.
        """
        def _do():
            self.status_var.set(msg)

        self.root.after(0, _do)


###############################################################################
# 5. Main Function
###############################################################################
def main():
    if "YOUR_GOOGLE_API_KEY" in API_KEY or "YOUR_CSE_ID" in CSE_ID:
        print(
            "WARNING: You have not set valid Google Custom Search credentials. "
            "Searching may fail or return an error."
        )

    google_client = GoogleSearchClient(API_KEY, CSE_ID)
    llm_client = LocalLLMClient(OLLAMA_COMMAND, OLLAMA_MODEL_NAME)

    root = tk.Tk()
    # Expandable layout
    root.rowconfigure(0, weight=1)
    root.columnconfigure(0, weight=1)

    app = AppGUI(root, google_client, llm_client)
    root.mainloop()


if __name__ == "__main__":
    main()
