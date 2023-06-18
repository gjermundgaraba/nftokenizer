import { CSSProperties } from "react";
import { useLoadingContext } from "./loading-context";
import './loading-overlay.css';

export default function LoadingOverlay() {
  const loadingContext = useLoadingContext();

  if (!loadingContext.loading) {
    return <></>;
  }

  const loadingStyle: CSSProperties = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  }

  const loadingContainer: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    fontSize: '2rem',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  }

  return (
    <div style={loadingStyle}>
      <div style={loadingContainer}>
        <div className='dot'></div>
        <div className='dot'></div>
        <div className='dot'></div>
        <div className='dot'></div>
        <div className='dot'></div>
      </div>
    </div>
  )
}