const styles = `
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 80px 24px;
    text-align: center;
  }

  .state-icon {
    font-size: 40px;
    opacity: 0.5;
  }

  .state-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
  }

  .state-msg {
    font-size: 13px;
    color: var(--muted);
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-box {
    background: rgba(255, 106, 155, 0.06);
    border: 1px solid rgba(255, 106, 155, 0.2);
    border-radius: 8px;
    padding: 16px;
    font-size: 12px;
    color: var(--accent2);
    max-width: 400px;
    text-align: center;
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
`;

// Inyectar estilos una sola vez
if (!document.getElementById("state-view-styles")) {
  const tag = document.createElement("style");
  tag.id = "state-view-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

/**
 * StateView – muestra un estado visual según la prop `type`:
 *   "loading"  → spinner
 *   "error"    → mensaje de error + botón reintentar
 *   "empty"    → tabla vacía
 */
export default function StateView({ type, message, onRetry }) {
  if (type === "loading") {
    return (
      <div className="state">
        <div className="spinner" />
        <p className="state-title">Cargando aprendices…</p>
        {message && <p className="state-msg">{message}</p>}
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="state">
        <div className="state-icon">⚡</div>
        <p className="state-title">No se pudo conectar</p>
        <div className="error-box">
          {message}
          <br />
          <br />
          Asegúrate de que tu API esté corriendo y que CORS esté habilitado.
        </div>
        {onRetry && (
          <button className="refresh-btn" onClick={onRetry}>
            ↻ Reintentar
          </button>
        )}
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className="state">
        <div className="state-icon">○</div>
        <p className="state-title">Sin registros</p>
        <p className="state-msg">La tabla adso_nocturno está vacía.</p>
      </div>
    );
  }

  return null;
}