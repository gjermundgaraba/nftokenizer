import { ReactNode } from "react";
import "../app/styles/pixel-modal.css";
import { PixelModalCard } from "./pixel-card";

interface BaseModalProps {
  children: ReactNode;
  open: boolean;
  close: () => void;
  title: string;
  closeBtnText: string;
  backgroundColor: string;
  innerPadding: string
}

type ModalProps = Omit<BaseModalProps, "title" | "closeBtnText" | "backgroundColor" | "innerPadding">;

export default function Modal(props: BaseModalProps) {
  const { children, open, close, title, closeBtnText, backgroundColor, innerPadding } = props;

  if (!open) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <p className="text-white modal-title">{title}</p>
        <PixelModalCard backgroundColor={backgroundColor} innerPadding={innerPadding}>
          {children}
        </PixelModalCard>
        <button onClick={close} className="back-button">{closeBtnText}</button>
      </div>
    </div>
  )
}

export function CreateNftSlotModal(props: ModalProps) {
  const { children, open, close } = props;

  return (
    <Modal
      open={open}
      close={close}
      title={"Create NFT Slot"}
      closeBtnText={"Go back"}
      backgroundColor={'#ffffff'}
      innerPadding={"74px 0 35px 0"}>
      {children}
    </Modal>
  )
}

export function MintingCompletedModal(props: ModalProps) {
  const { children, open, close } = props;

  return (
    <Modal
      open={open}
      close={close}
      title="Minting NFT completed"
      closeBtnText="Close"
      backgroundColor={"#FDC100"}
      innerPadding={"40px 40px 25px"}
    >
      {children}
    </Modal>
  )
}