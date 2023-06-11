import { ReactNode } from "react";
import PixelBaseCard from "./pixel-base-card";

export function PixelRouteButton({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      button={true}
      border={true}
      borderColor={'#ff7f36'}
      cardSize={'medium'}
      actionButton={false}
      routeButton={true}
      backgroundColor={'#FF5C00'}>
      {children}
    </PixelBaseCard>
  )
}

export function PixelActionButton({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      button={true}
      border={false}
      cardSize={'small'}
      actionButton={true}
      backgroundColor={'#ffffff'}>
      {children}
    </PixelBaseCard>
  )
}