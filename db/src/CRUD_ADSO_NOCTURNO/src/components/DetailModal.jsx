import { useAprendizDetail } from "../hooks/useAprendices";
import StateView from "./StateView";

const styles = `
  .detail-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .detail-panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    max-width: 480px;
    width: 90%;
    position: relative;
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .detail-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 32px;
    right: 32px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--accent),
      var(--accent2),
      transparent
    );
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .close-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .detail-id {
    font-size: 11px;
    color: var(--accent2);
    letter-spacing: 3px;
    margin-bottom: 8px;
    opacity: 0.8;
  }

  .detail-name {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 28px;
    background: linear-gradient(135deg, var(--text), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .detail-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }

  .detail-field:last-child {
    border-bottom: none;
  }

  .field-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
  }

  .field-value {
    font-size: 16px;
    color: var(--text);
  }
`;

// Inyectar estilos una sola vez
if (!document.getElementById("detail-modal-styles")) {
  const tag = document.createElement("style");
  tag.id = "detail-modal-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

/**
 * DetailModal – modal que muestra el detalle de un aprendiz por id.
 * Props:
 *   id: number         → id del aprendiz a consultar
 *   onClose: () => void
 */
export default function DetailModal({ id, onClose }) {
  const { data, loading, error } = useAprendizDetail(id);

  return (
    <div className="detail-overlay" onClick={onClose}>
      {/* Detener la propagación para no cerrar al hacer click dentro */}
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {loading && (
          <StateView
            type="loading"
            message={`Consultando /aprendices/${id}…`}
          />
        )}

        {error && (
          <StateView type="error" message={error} />
        )}

        {data && (
          <>
            <p className="detail-id">
              APRENDIZ #{String(data.id).padStart(3, "0")}
            </p>
            <p className="detail-name">{data.nombre}</p>

            <div className="detail-field">
              <span className="field-label">Correo electrónico</span>
              <span className="field-value">{data.correo}</span>
            </div>

            <div className="detail-field">
              <span className="field-label">Edad</span>
              <span className="field-value">{data.edad} años</span>
            </div>

            <div className="detail-field">
              <span className="field-label">ID del sistema</span>
              <span className="field-value">{data.id}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}