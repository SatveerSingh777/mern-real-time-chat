const PrivateChat = ({ messages, username, activeRoom, onExit }) => (
  <>
    <div className="top-nav">
      <div>
        <h3 style={{margin: 0, color: 'var(--accent)'}}>🔒 {activeRoom.toUpperCase()}</h3>
        <span style={{fontSize: '0.8rem', color: '#888'}}>Encrypted Transmission</span>
      </div>
      <button className="btn-send" style={{background: '#3d1010', color: '#ff4d4d', width: 'auto', padding: '0 20px'}} onClick={onExit}>TERMINATE</button>
    </div>
    <div className="chat-body">
      {messages.map((msg, i) => (
        <div key={i} className={`msg-row ${msg.username === username ? 'mine' : 'theirs'}`}>
          <span style={{fontSize: '0.7rem', color: '#555', marginBottom: '2px'}}>{msg.username}</span>
          <div className="bubble">{msg.message}</div>
        </div>
      ))}
    </div>
  </>
);
export default PrivateChat;