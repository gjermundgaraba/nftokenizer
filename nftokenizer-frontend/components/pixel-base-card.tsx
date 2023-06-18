import { ReactNode } from "react";
import "../app/styles/pixel-card.css";


interface PixelBaseCardProps {
  children: ReactNode;
  border: boolean;
  borderColor?: string;
  button: boolean;
  cardSize: "big" | "medium" | "small";
  routeButton?: boolean;
  actionButton?: boolean;
  innerPadding?: string;
  backgroundColor: string;
}

type PixelInnerProps = Omit<PixelBaseCardProps, "button" | "cardSize" | "routeButton" | "actionButton">;
type PixelButtonInnerProps = Omit<PixelBaseCardProps, "button" | "cardSize" | "innerPadding">;


export default function PixelBaseCard(props: PixelBaseCardProps) {
  const { children, border, borderColor, button, cardSize, routeButton, actionButton, innerPadding, backgroundColor } = props;

  return (
    <main className="main">
      <div className={`
        pixel-card
        flex 
        ${actionButton && "action-button"} 
        ${routeButton && "route-button"}
        ${cardSize === "big"
          ? "big" : cardSize === "medium"
            ? "medium" : cardSize === "small"
              ? "small" : ""}
      `}>
        <div className="pixel-vertical-line left-side"></div>
        <div className="card-inside-container">
          <PixelBorder position="top" />

          {button
            ? <PixelButtonInner
              border={border}
              borderColor={borderColor}
              routeButton={routeButton}
              actionButton={actionButton}
              backgroundColor={backgroundColor}>
              {children}
            </PixelButtonInner>
            : <PixelInner
              border={border}
              borderColor={borderColor}
              innerPadding={innerPadding}
              backgroundColor={backgroundColor}>
              {children}
            </PixelInner>
          }

          <PixelBorder position="bottom" />
        </div>
        <div className="pixel-vertical-line right-side"></div>

      </div>
    </main>
  )
}

export function PixelBorder({ position }: { position: string }) {
  return (
    <div className="flex relative">
      <div className={`pixel-corner ${position === 'top' ? "upper-left" : "lower-left"}`}></div>
      <div className="pixel-horizontal-line"></div>
      <div className="relative">
        <div className={`pixel-corner ${position === 'top' ? "upper-right" : "lower-right"}`}></div>
      </div>

    </div>
  )
}

export function PixelInner(props: PixelInnerProps) {
  const { children, border, borderColor, innerPadding, backgroundColor } = props;

  return (
    <div className={`inner-container-wrapper ${border && "border"}`} style={{ borderColor: borderColor }} >
      <div className="inner-container break-word" style={{ padding: innerPadding, backgroundColor: backgroundColor }}>{children}</div>
    </div>
  )
}


export function PixelButtonInner(props: PixelButtonInnerProps) {
  const { children, border, borderColor, routeButton, actionButton, backgroundColor } = props

  return (
    <div className={`inner-container-wrapper ${border && "border"}`} style={{ borderColor: borderColor }}>
      <div className={`
        inner-container 
        break-word 
        flex 
        items-center 
        justify-center 
        ${routeButton && "route-btn"} 
        ${actionButton && "action-text"}`} style={{ backgroundColor: backgroundColor }}>
        {children}
      </div>
    </div>
  )
}
