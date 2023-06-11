import { ReactNode } from "react";
import PixelBaseCard from "./pixel-base-card";

export function PixelGreenBorderCard({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard button={false} border={true} borderColor={'#CCF473'} cardSize="big" innerPadding="80px 56px" backgroundColor="#F5F5F5">
      {children}
    </PixelBaseCard>
  )
}

export function PixelDropdown({ children }: { children: ReactNode }) {
  return (
    <PixelBaseCard button={false} border={false} cardSize="small" innerPadding="12px" backgroundColor="#949494">
      {children}
    </PixelBaseCard >
  )
}