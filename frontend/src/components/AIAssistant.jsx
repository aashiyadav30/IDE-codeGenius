import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {

      const res = await axios.post('http://localhost:5000/api/gpt/chat', {

        message: input,
      });

      const aiMessage = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg = { role: 'assistant', content: 'AI Error: Unable to fetch response.' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div className="ai-panel">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Message gpt-4o-mini"
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default AIAssistant;
