import QRGenerator from './components/QRGenerator'

export default function App() {
  return (
    <div className="app">
      {/* Ambient module-grid backdrop */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <main className="card">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <span className="finder" />
            </span>
            <span className="brand-name">
              QR<span className="brand-accent">LAB</span>
            </span>
          </div>
          <div className="status">
            <span className="status-dot" />
            LIVE PREVIEW
          </div>
        </header>

        <p className="tagline">
          A precision QR studio. Type anything &mdash; watch it resolve into a
          scannable code you can tune, download, and copy.
        </p>

        <QRGenerator />
      </main>

      <footer className="footer">
        <span className="footer-rule" />
        QRLab by Kingsley Chen
      </footer>
    </div>
  )
}
