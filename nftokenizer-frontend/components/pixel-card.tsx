
export default function PixelCard({ children, greenBorder }) {
  return (
    <main className="main">
      <div className="flex card-wrapper">
        <div className="pixel-vertical-line left-side"></div>
        <div className="card-inside-container">
          <PixelBorder position="top" />
          <PixelInner greenBorder={greenBorder}>{children}</PixelInner>
          <PixelBorder position="bottom" />
        </div>
        <div className="pixel-vertical-line right-side"></div>
      </div>

    </main >
  )
}

export function PixelBorder({ position }: { position: string }) {
  return (
    <div className="flex">
      <div className={`pixel-corner ${position === 'top' ? "upper-left" : "lower-left"}`}></div>
      <div className="pixel-horizontal-line"></div>
      <div className={`pixel-corner ${position === 'top' ? "upper-right" : "lower-right"}`}></div>
    </div>
  )
}

export function PixelInner({ children, greenBorder }) {
  return (
    <div className={`inner-container-wrapper ${greenBorder && "green-border"}`} >
      <div className="inner-container py-20 px-14 break-word">{children}</div>
    </div>
  )
}