"use client";

import { useRef, useState, type FormEvent } from "react";

type EvidenceKind = "Mensaje" | "Captura" | "URL" | "Número";
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
  const fileInput = useRef<HTMLInputElement>(null);

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    const suffix = Math.floor(100000 + Math.random() * 900000);
    setReportId(`MX-SIM-${new Date().getFullYear()}-${suffix}`);
    setError("");
  }

  function resetForm() {
    setReportId("");
    setEvidence("");
    setScreenshot(null);
    setError("");
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
              <p className="status"><span aria-hidden="true" /> Estado: <strong>Reportado</strong></p>
              <div className="guidance">
                <h3>Mientras tanto, cuídate</h3>
                <ul>
                  <li>No respondas.</li>
                  <li>No hagas clic en enlaces.</li>
                  <li>No compartas información personal o bancaria.</li>
                </ul>
              </div>
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
