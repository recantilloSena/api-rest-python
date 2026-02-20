import { useState } from "react";
import { useAprendices } from "./hooks/useAprendices";
import AprendizCard from "./components/AprendizCard";
import DetailModal from "./components/DetailModal";
import StateView from "./components/StateView";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg:      #0a0a0f;
    --surface: #111118;
    --card:    #16161f;
    --border:  #2a2a3a;
    --accent:  #7c6aff;
    --accent2: #ff6a9b;
    --text:    #e8e8f0;
    --muted:   #6a6a8a;
    --success: #4affa8;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(124,106,255,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(255,106,155,0.1) 0%, transparent 60%);
  }

  /* ── Layout ── */
  .app {
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  /* ── Header ── */
  .header {
    margin-bottom: 48px;
    animation: fadeDown 0.6s ease both;
  }

  .header-label {
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.8;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1;
    background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }

  .subtitle {
    color: var(--muted);
    font-size: 13px;
    letter-spacing: 0.5px;
  }

  .endpoint-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(124, 106, 255, 0.08);
    border: 1px solid rgba(124, 106, 255, 0.2);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    color: var(--accent);
    margin-top: 16px;
  }

  .endpoint-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 6px var(--success);
    animation: pulse 2s infinite;
  }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    animation: fadeDown 0.6s 0.15s ease both;
  }

  .count-badge {
    font-size: 12px;
    color: var(--muted);
  }

  .count-badge span {
    color: var(--accent);
    font-weight: 600;
  }

  .refresh-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .refresh-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* ── Grid ── */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* ── Animations ── */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// Inyectar estilos globales una sola vez
if (!document.getElementById("global-styles")) {
  const tag = document.createElement("style");
  tag.id = "global-styles";
  tag.textContent = globalStyles;
  document.head.appendChild(tag);
}

export default function App() {
  const { data, loading, error, refresh } = useAprendices();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <p className="header-label">ADSO · Nocturno</p>
        <h1>Aprendices</h1>
        <p className="subtitle">Gestión del grupo · FastAPI + PostgreSQL</p>
        <div className="endpoint-badge">
          <span className="dot" />
          http://localhost:8000/aprendices
        </div>
      </header>

      {/* ── Toolbar (solo cuando hay datos) ── */}
      {!loading && !error && data.length > 0 && (
        <div className="toolbar">
          <p className="count-badge">
            <span>{data.length}</span> aprendices registrados
          </p>
          <button className="refresh-btn" onClick={refresh}>
            ↻ Actualizar
          </button>
        </div>
      )}

      {/* ── Estados ── */}
      {loading && (
        <StateView
          type="loading"
          message="Consultando http://localhost:8000/aprendices"
        />
      )}

      {!loading && error && (
        <StateView type="error" message={error} onRetry={refresh} />
      )}

      {!loading && !error && data.length === 0 && (
        <StateView type="empty" />
      )}

      {/* ── Grid de tarjetas ── */}
      {!loading && !error && data.length > 0 && (
        <div className="grid">
          {data.map((aprendiz, index) => (
            <AprendizCard
              key={aprendiz.id}
              aprendiz={aprendiz}
              index={index}
              onClick={setSelectedId}
            />
          ))}
        </div>
      )}

      {/* ── Modal de detalle ── */}
      {selectedId && (
        <DetailModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}