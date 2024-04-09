import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { message: input, sender: 'user' }]);
    setInput('');

    try {
      // Send user message to backend
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataset_path: '/path/to/dataset' }), // Adjust dataset path
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();

      // Add bot response to chat history
      setChatHistory([...chatHistory, { message: data.message, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error.message);
      // console.log('Response:', data);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.sender}`}>
              {chat.message}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

// console.log('Response:', data);

export default App;
