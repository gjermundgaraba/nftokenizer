import { PixelBorder } from "./pixel-card";

export default function PixelButton({ children, actionButton, routeButton }) {
  return (
    <main className="main">
      <div className={`flex pixel-button-wrapper ${actionButton && "action-button"}`}>
        <div className="pixel-vertical-line left-side"></div>
        <div className="card-inside-container">
          <PixelBorder position="top" />
          <PixelButtonInner routeButton={routeButton} actionButton={actionButton}>{children}</PixelButtonInner>
          <PixelBorder position="bottom" />
        </div>
        <div className="pixel-vertical-line right-side"></div>
      </div>

    </main >
  )
}

export function PixelButtonInner({ children, routeButton, actionButton }) {
  return (
    <div className={`inner-container-wrapper ${routeButton && "orange-border"} `} >
      <div className={`inner-container break-word flex items-center justify-center ${routeButton && "route-btn"} ${actionButton && "action-text"}`}>
        {children}
      </div>
    </div>
  )
}