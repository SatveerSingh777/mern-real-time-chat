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

        .bubble {
          padding: clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 20px);
          border-radius: 22px;
          max-width: min(75%, 520px);
          font-size: clamp(0.82rem, 2vw, 0.95rem);
          line-height: 1.5;
          position: relative;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          word-break: break-word;
        }

        .mine .bubble {
          background: var(--grad);
          color: white;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
        }

        .theirs .bubble {
          background: var(--glass);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
          align-self: flex-start;
        }

        /* --- DOCK --- */
        .dock {
          margin: clamp(8px, 2vw, 20px) clamp(12px, 4vw, 40px) clamp(12px, 3vw, 30px);
          padding: clamp(6px, 1.5vw, 10px);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: clamp(8px, 2vw, 15px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .input-field {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: clamp(0.85rem, 2.5vw, 1rem);
          outline: none;
          padding: 5px;
          min-width: 0;
        }

        .icon-btn {
          width: clamp(38px, 8vw, 48px);
          height: clamp(38px, 8vw, 48px);
          border-radius: 18px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
        }

        .ai-trigger { background: #1a1e23; color: var(--accent); border: 1px solid var(--border); }
        .ai-trigger:hover { background: var(--accent); color: #000; box-shadow: 0 0 20px var(--accent); }

        .send-trigger { background: var(--wa-green); color: white; }
        .send-trigger:hover { transform: scale(1.05); box-shadow: 0 0 20px var(--wa-green); }

        /* --- TYPING STATUS --- */
        .typing-status {
          height: 20px;
          padding-left: clamp(16px, 4vw, 50px);
          font-size: clamp(0.7rem, 1.8vw, 0.8rem);
          color: var(--wa-green);
        }

        /* --- MODAL --- */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
          padding: 20px;
        }

        .modal-box {
          background: #111;
          padding: clamp(24px, 5vw, 40px);
          border-radius: 30px;
          border: 1px solid var(--accent);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }

        .modal-input {
          width: 100%;
          background: #1a1e23;
          border: 1px solid var(--border);
          padding: clamp(10px, 2.5vw, 15px);
          border-radius: 15px;
          color: white;
          margin-bottom: 15px;
          outline: none;
          font-size: clamp(0.85rem, 2vw, 1rem);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className="main-card">
        {activeRoom === 'global' ? (
          <WorldChat
            messages={messages}
            username={username}
            setUsername={setUsername}
            onOpenPrivate={() => setShowModal(true)}
          />
        ) : (
          <PrivateChat
            messages={messages}
            username={username}
            activeRoom={activeRoom}
            onExit={() => socket.emit('goGlobal')}
          />
        )}

        <div className="typing-status">{typingStatus}</div>

        <footer className="dock">
          <input
            className="input-field"
            placeholder="Share your thoughts..."
            value={message}
            onChange={handleInputChange}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button className="icon-btn send-trigger" onClick={handleSend}>➤</button>
          <button className="icon-btn ai-trigger" onClick={() => socket.emit('askAI', { username, question: message })}>✨</button>
        </footer>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 style={{ color: 'var(--accent)', marginBottom: '10px', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}>
              Private Access
            </h2>
            <p style={{ color: '#8696a0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', marginBottom: '25px' }}>
              Enter the coordinates for the secure room.
            </p>
            <input
              className="modal-input"
              placeholder="Room Name"
              onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
            />
            <input
              className="modal-input"
              type="password"
              placeholder="Passkey"
              onChange={e => setRoomForm({ ...roomForm, pass: e.target.value })}
            />
            <button
              className="icon-btn send-trigger"
              style={{ width: '100%', borderRadius: '15px', height: 'clamp(42px, 8vw, 52px)' }}
              onClick={() => socket.emit('joinPrivate', { room: roomForm.name, password: roomForm.pass, username })}
            >
              Open Channel
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{ marginTop: '15px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
            >
              Abort Mission
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
