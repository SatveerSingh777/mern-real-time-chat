const PrivateChat = ({ messages, username, activeRoom, onExit }) => (
  <>
    <div
      className="top-nav"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 30px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div>
        <h3 style={{
          margin: 0,
          color: 'var(--accent)',
          fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
          letterSpacing: '0.5px',
        }}>
          🔒 {activeRoom.toUpperCase()}
        </h3>
        <span style={{
          fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
          color: '#888',
        }}>
          Encrypted Transmission
        </span>
      </div>

      <button
        className="btn-send"
        onClick={onExit}
        style={{
          background: '#3d1010',
          color: '#ff4d4d',
          width: 'auto',
          padding: 'clamp(7px, 1.5vw, 10px) clamp(12px, 3vw, 20px)',
          fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
          fontWeight: 'bold',
          border: '1px solid #5a1a1a',
          borderRadius: '10px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        TERMINATE
      </button>
    </div>

    <div
      className="chat-body"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'clamp(10px, 2vw, 16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`msg-row ${msg.username === username ? 'mine' : 'theirs'}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 'min(80%, 520px)',
            alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
            alignItems: msg.username === username ? 'flex-end' : 'flex-start',
          }}
        >
          <span style={{
            fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
            color: '#555',
            marginBottom: '2px',
            padding: '0 4px',
          }}>
            {msg.username}
          </span>
          <div
            className="bubble"
            style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}
          >
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  </>
);

export default PrivateChat;
