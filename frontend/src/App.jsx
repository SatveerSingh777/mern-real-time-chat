import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import WorldChat from './Components/WorldChat';
import PrivateChat from './Components/PrivateChat';

const socket = io('https://mern-real-time-chat-p3sj.onrender.com');

function App() {
  const [username, setUsername] = useState('Op_' + Math.floor(Math.random() * 999));
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState('global');
  const [typingStatus, setTypingStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [roomForm, setRoomForm] = useState({ name: '', pass: '' });

  const scrollRef = useRef();

  useEffect(() => {
    socket.on('message', (data) => setMessages((prev) => [...prev, data]));
    socket.on('displayTyping', (data) => setTypingStatus(data.isTyping ? `${data.username} is typing...` : ""));
    socket.on('roomJoined', (room) => { setActiveRoom(room); setMessages([]); setShowModal(false); });
    return () => socket.off();
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    socket.emit('typing', { username, isTyping: e.target.value.length > 0 });
  };

  const handleSend = () => {
    if (!message.trim()) return;
    socket.emit('message', { username, message });
    socket.emit('typing', { username, isTyping: false });
    setMessage('');
  };

  return (
    <div className="aurora-container">
      <style>{`
        * { box-sizing: border-box; }

        :root {
          --accent: #00f2fe;
          --wa-green: #00a884;
          --glass: rgba(255, 255, 255, 0.03);
          --border: rgba(255, 255, 255, 0.08);
          --grad: linear-gradient(135deg, #00b09b, #96c93d);
        }

        .aurora-container {
          height: 100dvh;
          width: 100vw;
          background: #080a0c;
          background-image:
            radial-gradient(at 0% 0%, rgba(0, 242, 254, 0.1) 0, transparent 50%),
            radial-gradient(at 100% 100%, rgba(0, 168, 132, 0.1) 0, transparent 50%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', system-ui, sans-serif;
          color: #e9edef;
        }

        .main-card {
          width: 100%;
          height: 100dvh;
          background: rgba(15, 20, 25, 0.6);
          backdrop-filter: blur(30px);
          border: none;
          border-radius: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 50px 100px rgba(0,0,0,0.6);
          overflow: hidden;
        }

        @media (min-width: 600px) {
          .main-card {
            width: 95%;
            height: 92vh;
            max-width: 1200px;
            border: 1px solid var(--border);
            border-radius: 32px;
          }
        }

        /* --- CHAT AREA --- */
        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: clamp(16px, 4vw, 40px);
          background-image: radial-gradient(circle at center, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 30px 30px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .system-pill {
          align-self: center;
          background: var(--glass);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: clamp(0.6rem, 1.5vw, 0.7rem);
          color: #8696a0;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 12px 0;
          border: 1px solid var(--border);
          text-align: center;
        }

        /* --- MSG ROWS --- */
        .msg-row {
          display: flex;
          flex-direction: column;
          max-width: min(75%, 520px);
          width: auto;
        }

        .msg-row.mine {
          align-self: flex-end;
          align-items: flex-end;
        }

        .msg-row.theirs {
          align-self: flex-start;
          align-items: flex-start;
        }

        /* --- BUBBLES --- */
        .bubble {
          padding: clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 20px);
          border-radius: 22px;
          width: fit-content;
          max-width: 100%;
          font-size: clamp(0.82rem, 2vw, 0.95rem);
          line-height: 1.5;
          position: relative;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          word-break: break-word;
          white-space: normal;
        }

        .mine .bubble {
          background: var(--grad);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .theirs .bubble {
          background: var(--glass);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }

        /* --- DOCK --- */
        .dock {
          margin: clamp(8px, 2vw, 20px) clamp(12px, 4vw, 40px) clamp(12px, 3vw, 30px);
          padding: clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 14px);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: clamp(6px, 1.5vw, 15px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .input-f
