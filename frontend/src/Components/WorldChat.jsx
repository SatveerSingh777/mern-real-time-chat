const WorldChat = ({ messages, username, setUsername, onOpenPrivate }) => (
  <>
    <header style={{
      padding: 'clamp(16px, 3vw, 30px) clamp(18px, 4vw, 40px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div>
        <h1 style={{
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          margin: 0,
          letterSpacing: '-1px',
        }}>
          World Stream
        </h1>
        <span style={{
          color: 'var(--wa-green)',
          fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
          fontWeight: 'bold',
        }}>
          ● LIVE PUBLIC FEED
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: 'clamp(8px, 2vw, 15px)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          style={{
            background: 'var(--glass)',
            border: '1px solid var(--border)',
            color: 'white',
            padding: 'clamp(7px, 1.5vw, 10px) clamp(10px, 2vw, 15px)',
            borderRadius: '12px',
            width: 'clamp(90px, 20vw, 120px)',
            fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
            minWidth: 0,
          }}
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button
          onClick={onOpenPrivate}
          style={{
            background: 'var(--accent)',
            border: 'none',
            padding: 'clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 20px)',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#000',
            fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
            whiteSpace: 'nowrap',
          }}
        >
          + SECURE ROOM
        </button>
      </div>
    </header>

    <div
      className="chat-area"
      style={{
        padding: 'clamp(10px, 2vw, 16px)',
        overflowY: 'auto',
        flex: 1,
      }}
    >
      {messages.map((msg, i) =>
        msg.type === 'system' ? (
          <div key={i} className="system-pill">
            {msg.message}
          </div>
        ) : (
          <div
            key={i}
            className={`msg-row ${msg.username === username ? 'mine' : 'theirs'}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 'min(80%, 520px)',
              alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
            }}
          >
            <span style={{
              fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
              opacity: 0.4,
              margin: '0 10px 4px',
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
        )
      )}
    </div>
  </>
);

export default WorldChat;
