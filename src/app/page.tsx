"use client";

import { useRef, useState, type FormEvent } from "react";

type EvidenceKind = "Mensaje" | "Captura" | "URL" | "Número";
type ReportStatus = "Reportado" | "En revisión" | "Patrón confirmado" | "Evidencia insuficiente";
const kinds: { name: EvidenceKind; mark: string }[] = [
  { name: "Mensaje", mark: "Aa" },
  { name: "Captura", mark: "IMG" },
  { name: "URL", mark: "↗" },
  { name: "Número", mark: "№" },
];

export default function Home() {
  const [kind, setKind] = useState<EvidenceKind>("Mensaje");
  const [evidence, setEvidence] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [reportId, setReportId] = useState("");
  const [status, setStatus] = useState<ReportStatus>("Reportado");
  const fileInput = useRef<HTMLInputElement>(null);

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEvidence = evidence.trim();
    if (evidence.trim().length === 0 && !(kind === "Captura" && screenshot)) {
      setError("Agrega la evidencia antes de reportar.");
      return;
    }
    if (evidence.length > 1000) {
      setError("La evidencia no puede superar 1000 caracteres.");
      return;
    }
    if (kind === "Captura" && !screenshot) {
      setError("Selecciona una captura para continuar.");
      return;
    }
    if (kind === "URL") {
      try {
        const parsedUrl = new URL(trimmedEvidence);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          setError("Usa una dirección web que empiece con http:// o https://.");
          return;
        }
      } catch {
        setError("Escribe una dirección web válida, por ejemplo https://sitio.mx.");
        return;
      }
    }
    if (kind === "Número") {
      const digits = trimmedEvidence.replace(/\D/g, "");
      if (!/^[\d+().\s-]+$/.test(trimmedEvidence) || digits.length < 7 || digits.length > 18) {
        setError("Escribe un número con entre 7 y 18 dígitos.");
        return;
      }
    }
    const suffix = Math.floor(100000 + Math.random() * 900000);
    setReportId(`MX-SIM-${new Date().getFullYear()}-${suffix}`);
    setStatus("Reportado");
    setError("");
  }

  function resetForm() {
    setReportId("");
    setEvidence("");
    setScreenshot(null);
    setError("");
    setStatus("Reportado");
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="AlertaMX, inicio">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>Alerta<span className="brand-accent">MX</span></span>
        </a>
        <span className="demo-label">Prototipo · datos simulados</span>
      </header>

      <section className="content-grid" id="inicio">
        <div className="intro">
          <p className="eyebrow">REPORTE CIUDADANO</p>
          <h1>¿Te llegó algo <span>sospechoso?</span></h1>
          <p className="intro-copy">Compártelo para recibir orientación inmediata. No necesitas decidir si es fraude.</p>
          <p className="prototype-note">Este prototipo no envía ni guarda tu reporte.</p>
        </div>

        <section className="form-panel" aria-labelledby="form-heading">
          {reportId ? (
            <div className="receipt" aria-live="polite">
              <span className="success-mark" aria-hidden="true">✓</span>
              <p className="eyebrow">CONFIRMACIÓN</p>
              <h2 id="form-heading">Recibimos tu reporte</h2>
              <p className="receipt-copy">Este recibo es una simulación local.</p>
              <div className="report-id">
                <span>FOLIO DE DEMOSTRACIÓN · SIMULADO</span>
                <strong>{reportId}</strong>
              </div>
              <p className="status"><span aria-hidden="true" /> Estado: <strong>{status}</strong></p>
              <div className="guidance">
                <h3>Mientras tanto, cuídate</h3>
                <ul>
                  <li>No respondas.</li>
                  <li>No hagas clic en enlaces.</li>
                  <li>No compartas información personal o bancaria.</li>
                </ul>
              </div>
              {status === "Reportado" && (
                <button className="secondary-button" type="button" onClick={() => setStatus("En revisión")}>
                  Iniciar revisión simulada
                </button>
              )}
              {status === "En revisión" && (
                <div className="review-flow" aria-live="polite">
                  <div className="simulated-analysis">
                    <h3>Análisis · Simulado</h3>
                    <p><strong>Evidencia organizada:</strong> tipo {kind.toLowerCase()}, {evidence.trim().length} caracteres de texto y {screenshot ? "una captura adjunta" : "sin captura adjunta"}.</p>
                    <p><strong>Comprobación de indicadores:</strong> simulada, sin consulta a fuentes externas.</p>
                    <p>Este análisis no determina fraude ni identifica personas u organizaciones.</p>
                  </div>
                  <div className="human-review">
                    <h3>Esperando revisión humana</h3>
                    <p>Una persona capacitada revisará el caso. Tú no tienes que decidir si es fraude.</p>
                    <p>Para esta demostración, el siguiente resultado será una simulación de esa revisión humana.</p>
                    <button className="decision-button" type="button" onClick={() => setStatus(Math.random() < 0.5 ? "Patrón confirmado" : "Evidencia insuficiente")}>
                      Ver resultado simulado
                    </button>
                  </div>
                </div>
              )}
              {(status === "Patrón confirmado" || status === "Evidencia insuficiente") && (
                <div className="final-result" aria-live="polite">
                  <span>RESULTADO · SIMULADO</span>
                  <strong>{status}</strong>
                  <p>Resultado de una revisión humana simulada; no es una decisión tuya ni de la IA y no confirma hechos sobre ninguna persona u organización.</p>
                </div>
              )}
              <button className="secondary-button" type="button" onClick={resetForm}>Hacer otro reporte</button>
            </div>
          ) : (
            <form onSubmit={submitReport} noValidate>
              <p className="form-kicker">NUEVO REPORTE</p>
              <h2 id="form-heading">Cuéntanos qué recibiste</h2>

              <fieldset className="kind-fieldset">
                <legend>Tipo de evidencia</legend>
                <div className="kind-picker">
                  {kinds.map(({ name, mark }) => (
                    <button className={`kind-option${kind === name ? " selected" : ""}`} key={name} type="button" aria-pressed={kind === name} onClick={() => setKind(name)}>
                      <span className="kind-mark" aria-hidden="true">{mark}</span>{name}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="field-label" htmlFor="evidence">{kind === "Captura" ? "Contexto (opcional)" : "Evidencia sospechosa"}</label>
              <textarea
                id="evidence"
                value={evidence}
                maxLength={1000}
                onChange={(event) => setEvidence(event.target.value)}
                placeholder={kind === "URL" ? "https://ejemplo.mx/enlace" : kind === "Número" ? "+52 55 1234 5678" : "Pega aquí el mensaje o agrega contexto..."}
                aria-describedby="evidence-count"
              />
              <div className="input-meta"><span>No incluyas contraseñas ni códigos.</span><span id="evidence-count">{evidence.length}/1000</span></div>

              <label className="field-label upload-label" htmlFor="screenshot">Captura de pantalla <span>· opcional</span></label>
              <input ref={fileInput} id="screenshot" className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setScreenshot(event.target.files?.[0] ?? null)} />
              <button className="upload-button" type="button" onClick={() => fileInput.current?.click()}>
                <span className="upload-mark" aria-hidden="true">IMG</span>
                <span>{screenshot?.name ?? "Adjunta una imagen · JPG, PNG o WEBP"}</span>
                <strong>Elegir</strong>
              </button>

              {error && <p className="error-message" role="alert">{error}</p>}
              <button className="submit-button" type="submit">Reportar <span aria-hidden="true">→</span></button>
              <p className="disclaimer">No compartas información bancaria, contraseñas ni códigos.</p>
            </form>
          )}
        </section>
      </section>

      <footer className="footer">AlertaMX <span>·</span> Prototipo de demostración</footer>
    </main>
  );
}
