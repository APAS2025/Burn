import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FoodItem } from '../types';
import { getProductByBarcode } from '../services/openFoodFactsService';
import { XIcon, BarcodeIcon, SparklesIcon } from './Icons';

// Explicitly type the BarcodeDetector for environments where it might not be defined
declare class BarcodeDetector {
  constructor(options?: { formats: string[] });
  detect(image: ImageBitmapSource): Promise<{ rawValue: string }[]>;
}

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodScanned: (food: FoodItem) => void;
}

type ScanState = 'scanning' | 'detected' | 'loading' | 'notFound' | 'error';

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose, onFoodScanned }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: 'environment' }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        streamRef.current = mediaStream;
        // Wait for the video to start playing to avoid empty frames
        videoRef.current.onloadedmetadata = () => {
          scanForBarcode();
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Could not access camera. Please check permissions and ensure you're on a secure (HTTPS) connection.");
    }
  }, [stopCamera]);

  const scanForBarcode = useCallback(() => {
    if (!videoRef.current || !detectorRef.current) return;
    
    intervalRef.current = window.setInterval(async () => {
      if (videoRef.current?.readyState === 4) { // HAVE_ENOUGH_DATA
        try {
          const barcodes = await detectorRef.current.detect(videoRef.current);
          if (barcodes.length > 0) {
            setDetectedBarcode(barcodes[0].rawValue);
            setScanState('detected');
          }
        } catch (err) {
          console.error("Barcode detection error:", err);
          setScanState('error');
        }
      }
    }, 200); // Scan every 200ms
  }, []);

  useEffect(() => {
    if (isOpen) {
      detectorRef.current = new BarcodeDetector({ formats: ['ean_13', 'upc_a', 'ean_8'] });
      setScanState('scanning');
      setDetectedBarcode(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);
  
  useEffect(() => {
    if (scanState === 'detected' && detectedBarcode) {
        stopCamera();
        setScanState('loading');
        getProductByBarcode(detectedBarcode).then(foodItem => {
            if (foodItem) {
                onFoodScanned(foodItem);
            } else {
                setScanState('notFound');
            }
        }).catch(err => {
            console.error(err);
            setScanState('error');
        });
    }
  }, [scanState, detectedBarcode, onFoodScanned, stopCamera]);

  const getStatusMessage = () => {
    switch (scanState) {
      case 'scanning': return "Point camera at a barcode";
      case 'detected': return `Barcode found: ${detectedBarcode}`;
      case 'loading': return "Fetching product info...";
      case 'notFound': return "Product not found. Try another.";
      case 'error': return "An error occurred. Please try again.";
      default: return "";
    }
  };

  const getStatusColor = () => {
     switch (scanState) {
      case 'notFound':
      case 'error':
        return 'bg-red-500/80';
      case 'detected':
        return 'bg-green-500/80';
      default:
        return 'bg-zinc-900/80';
     }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Scan Barcode</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-all transform hover:scale-110" aria-label="Close modal">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black relative min-h-[300px]">
          {cameraError ? (
            <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg max-w-sm">
              <p className="font-semibold">Camera Error</p>
              <p className="text-sm">{cameraError}</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[85%] max-w-sm h-32 border-4 border-white/50 rounded-lg shadow-lg" style={{ clipPath: 'polygon(0% 0%, 0% 100%, 25% 100%, 25% 75%, 75% 75%, 75% 100%, 100% 100%, 100% 0%, 75% 0%, 75% 25%, 25% 25%, 25% 0%)' }}></div>
              </div>
              <div className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg text-center text-white text-sm font-semibold transition-colors ${getStatusColor()}`}>
                {getStatusMessage()}
              </div>
            </>
          )}
          {scanState === 'loading' && (
             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10">
                <SparklesIcon className="w-12 h-12 text-amber-400 animate-pulse" />
                <p className="mt-4 text-lg font-semibold">Fetching Data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
