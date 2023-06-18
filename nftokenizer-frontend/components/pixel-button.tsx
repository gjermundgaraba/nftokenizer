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

export function PixelConfirmModalButton({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      cardSize={'medium'}
      border={false}
      button={true}
      backgroundColor={'#6E7889'}>
      {children}
    </PixelBaseCard>
  )
}

export function PixelMintButton({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      border={true}
      button={true}
      borderColor={"#ff7e36"}
      cardSize={"medium"}
      backgroundColor={"#FF5C00"}>
      {children}
    </PixelBaseCard>
  )
}

export function PixelMintCompletedButton({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      border={false}
      button={true}
      cardSize={"medium"}
      backgroundColor={"#fff"}>
      {children}
    </PixelBaseCard>
  )
}