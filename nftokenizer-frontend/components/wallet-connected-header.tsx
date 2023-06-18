import {ReactNode} from "react";

export function WalletConnectedHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between">
      <p className="font-bold text" >
        {children}
      </p>
      <p className="font-bold text logout">LOGOUT</p>
    </div>
  )
}