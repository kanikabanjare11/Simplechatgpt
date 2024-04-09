# server.py
import openai
from flask import Flask, request, jsonify
from celery import Celery

openai.api_key = ""

app = Flask(__name__)

# Initialize Celery
celery = Celery(app.name, broker='redis://localhost:6379/0')

# Route to trigger model fine-tuning task
@app.route('/', methods=['POST'])
def chat():
    messages = []  # Add this line
    # Get the user's message from the request
    user_message = request.json.get('message')

    # Add the user's message to the messages list
    messages.append({"role": "user", "content": user_message})

    # Get a response from the model
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    # Get the model's reply from the response
    reply = response["choices"][0]["message"]["content"]

    # Add the model's reply to the messages list
    messages.append({"role": "assistant", "content": reply})

    # Return the model's reply
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
