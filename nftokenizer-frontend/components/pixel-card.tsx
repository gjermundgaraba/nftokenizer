import { ReactNode } from "react";
import PixelBaseCard from "./pixel-base-card";

export function PixelGreenBorderCard({ children, innerPadding }: { children: ReactNode, innerPadding: string }) {
  return (
    <PixelBaseCard
      button={false}
      border={true}
      borderColor={'#CCF473'}
      cardSize="big"
      innerPadding={innerPadding}
      backgroundColor="#F5F5F5">
      {children}
    </PixelBaseCard>
  )
}

export function PixelDepositCard({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      button={false}
      border={true}
      borderColor={'#CCF473'}
      cardSize="big"
      innerPadding="40px 40px 25px"
      backgroundColor="#F5F5F5">
      {children}
    </PixelBaseCard>
  )
}

export function PixelMintCard({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      border={false}
      button={false}
      cardSize="big"
      backgroundColor={"#fff"}>
      {children}
    </PixelBaseCard>
  )
}

export function PixelMintInnerCard({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      border={true}
      button={false}
      cardSize={"big"}
      borderColor={"#FFA030"}
      backgroundColor={"#FF7E36"}>
      {children}
    </PixelBaseCard>
  )
}

export function PixelDropdown({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard
      button={false}
      border={false}
      cardSize="small"
      innerPadding="12px"
      backgroundColor="#949494">
      {children}
    </PixelBaseCard >
  )
}

export function PixelModalCard({ children, backgroundColor, innerPadding }: { children: ReactNode, backgroundColor: string, innerPadding: string }) {
  return (
    <PixelBaseCard
      button={false}
      border={false}
      cardSize="big"
      innerPadding={innerPadding}
      backgroundColor={backgroundColor}>
      {children}
    </PixelBaseCard >
  )
}