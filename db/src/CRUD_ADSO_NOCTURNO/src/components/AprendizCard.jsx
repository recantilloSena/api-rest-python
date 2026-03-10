const styles = `
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.5s ease both;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    opacity: 0;
    transition: opacity 0.2s;
  }

  .card:hover {
    border-color: rgba(124, 106, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(124, 106, 255, 0.12);
  }

  .card:hover::before {
    opacity: 1;
  }

  .card-id {
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 2px;
    margin-bottom: 10px;
    opacity: 0.7;
  }

  .card-name {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--text);
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
  }

  .info-row .icon {
    opacity: 0.6;
  }

  .info-row .value {
    color: var(--text);
    opacity: 0.85;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// Inyectar estilos una sola vez
if (!document.getElementById("aprendiz-card-styles")) {
  const tag = document.createElement("style");
  tag.id = "aprendiz-card-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

/**
 * AprendizCard – tarjeta individual de un aprendiz.
 * Props:
 *   aprendiz: { id, nombre, correo, edad }
 *   onClick: (id: number) => void
 *   index: number  (para el delay de animación)
 */
export default function AprendizCard({ aprendiz, onClick, index = 0 }) {
  return (
    <div
      className="card"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => onClick(aprendiz.id)}
    >
      <p className="card-id">#{String(aprendiz.id).padStart(3, "0")}</p>
      <p className="card-name">{aprendiz.nombre}</p>
      <div className="card-info">
        <div className="info-row">
          <span className="icon">✉</span>
          <span className="value">{aprendiz.correo}</span>
        </div>
        <div className="info-row">
          <span className="icon">◈</span>
          <span className="value">{aprendiz.edad} años</span>
        </div>
      </div>
    </div>
  );
}