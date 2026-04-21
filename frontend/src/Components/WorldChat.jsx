const WorldChat = ({ messages, username, setUsername, onOpenPrivate }) => (
  <>
    <header style={{padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)'}}>
      <div>
        <h1 style={{fontSize: '1.4rem', margin: 0, letterSpacing: '-1px'}}>World Stream</h1>
        <span style={{color: 'var(--wa-green)', fontSize: '0.8rem', fontWeight: 'bold'}}>● LIVE PUBLIC FEED</span>
      </div>
      <div style={{display: 'flex', gap: '15px'}}>
        <input style={{background: 'var(--glass)', border: '1px solid var(--border)', color: 'white', padding: '10px 15px', borderRadius: '12px', width: '120px'}} value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={onOpenPrivate} style={{background: 'var(--accent)', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#000'}}>+ SECURE ROOM</button>
      </div>
    </header>
    <div className="chat-area">
      {messages.map((msg, i) => (
        msg.type === 'system' ? (
          <div key={i} className="system-pill">{msg.message}</div>
        ) : (
          <div key={i} className={`msg-row ${msg.username === username ? 'mine' : 'theirs'}`} style={{display: 'flex', flexDirection: 'column'}}>
             <span style={{fontSize: '0.7rem', opacity: 0.4, margin: '0 10px 4px'}}>{msg.username}</span>
             <div className="bubble">{msg.message}</div>
          </div>
        )
      ))}
    </div>
  </>
);
export default WorldChat;