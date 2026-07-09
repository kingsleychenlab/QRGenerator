import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

/** Error correction levels supported by the QR spec, low → high redundancy. */
type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

const DEFAULTS = {
  value: '',
  size: 240,
  fgColor: '#0a0a0f',
  bgColor: '#ffffff',
  level: 'M' as ErrorLevel,
}

const ERROR_LEVELS: { value: ErrorLevel; label: string }[] = [
  { value: 'L', label: 'Low · 7%' },
  { value: 'M', label: 'Medium · 15%' },
  { value: 'Q', label: 'Quartile · 25%' },
  { value: 'H', label: 'High · 30%' },
]

export default function QRGenerator() {
  const [value, setValue] = useState(DEFAULTS.value)
  const [size, setSize] = useState(DEFAULTS.size)
  const [fgColor, setFgColor] = useState(DEFAULTS.fgColor)
  const [bgColor, setBgColor] = useState(DEFAULTS.bgColor)
  const [level, setLevel] = useState<ErrorLevel>(DEFAULTS.level)
  const [copied, setCopied] = useState(false)

  // Wraps the <canvas> qrcode.react renders so we can export it as an image.
  const previewRef = useRef<HTMLDivElement>(null)

  const trimmed = value.trim()
  const hasValue = trimmed.length > 0

  /** Grab the underlying canvas element from the preview container. */
  function getCanvas(): HTMLCanvasElement | null {
    return previewRef.current?.querySelector('canvas') ?? null
  }

  function handleDownload() {
    const canvas = getCanvas()
    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'qrgenerator-qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function handleCopy() {
    const canvas = getCanvas()
    if (!canvas) return

    // ClipboardItem image support is not universal (notably Firefox).
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
      return
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        // Clipboard write can be blocked by permissions; fail quietly.
      }
    }, 'image/png')
  }

  function handleReset() {
    setValue(DEFAULTS.value)
    setSize(DEFAULTS.size)
    setFgColor(DEFAULTS.fgColor)
    setBgColor(DEFAULTS.bgColor)
    setLevel(DEFAULTS.level)
    setCopied(false)
  }

  const canCopy = typeof ClipboardItem !== 'undefined'

  return (
    <div className="generator">
      {/* Input / controls */}
      <section className="panel controls">
        <div className="panel-label">Input</div>

        <div className="field">
          <label htmlFor="qr-input">Text or URL</label>
          <textarea
            id="qr-input"
            className="text-input"
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            autoFocus
          />
          {!hasValue && (
            <p className="hint">Enter some text or a link to generate a code.</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="qr-size">
            Size <span className="value-badge">{size}px</span>
          </label>
          <input
            id="qr-size"
            type="range"
            min={120}
            max={480}
            step={8}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="qr-fg">Foreground</label>
            <label className="color-input" htmlFor="qr-fg">
              <input
                id="qr-fg"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
              <span className="color-value">{fgColor}</span>
            </label>
          </div>

          <div className="field">
            <label htmlFor="qr-bg">Background</label>
            <label className="color-input" htmlFor="qr-bg">
              <input
                id="qr-bg"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <span className="color-value">{bgColor}</span>
            </label>
          </div>
        </div>

        <div className="field">
          <label htmlFor="qr-level">Error correction</label>
          <select
            id="qr-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as ErrorLevel)}
          >
            {ERROR_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Live preview + actions */}
      <section className="panel preview">
        <div className="panel-label">Output</div>

        <div className={`viewfinder${hasValue ? ' is-live' : ''}`}>
          <span className="bracket tl" aria-hidden="true" />
          <span className="bracket tr" aria-hidden="true" />
          <span className="bracket bl" aria-hidden="true" />
          <span className="bracket br" aria-hidden="true" />

          <div className="qr-frame" ref={previewRef}>
            {hasValue ? (
              <QRCodeCanvas
                value={trimmed}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level={level}
                marginSize={2}
              />
            ) : (
              <div
                className="qr-placeholder"
                style={{ width: size, height: size }}
              >
                <span>Awaiting input</span>
              </div>
            )}
          </div>

          {/* Scan-line sweep — replays whenever the encoded content changes */}
          {hasValue && (
            <span key={trimmed} className="scanline" aria-hidden="true" />
          )}
        </div>

        {/* Instrument readout */}
        <div className="readout" role="status">
          <span className={`readout-dot${hasValue ? ' on' : ''}`} />
          <span className="readout-main">
            {hasValue ? 'Ready' : 'Awaiting input'}
          </span>
          <span className="readout-sep">/</span>
          <span>{trimmed.length} chars</span>
          <span className="readout-sep">/</span>
          <span>ECC {level}</span>
        </div>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={!hasValue}
          >
            Download PNG
          </button>
          {canCopy && (
            <button className="btn" onClick={handleCopy} disabled={!hasValue}>
              {copied ? 'Copied' : 'Copy image'}
            </button>
          )}
          <button className="btn btn-ghost" onClick={handleReset}>
            Reset
          </button>
        </div>
      </section>
    </div>
  )
}
