
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FoodItem } from '../types';
import { getFoodAnalysisFromImage } from '../services/geminiService';
import { CameraIcon, SparklesIcon, XIcon } from './Icons';

interface CameraAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFoods: (foods: FoodItem[]) => void;
  defaultEatMinutes: number;
}

const CameraAnalysisModal: React.FC<CameraAnalysisModalProps> = ({ isOpen, onClose, onAddFoods, defaultEatMinutes }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (stream) return;
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraError("Camera access was denied. Please enable camera permissions in your browser settings.");
    }
  }, [stream]);
  
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setError(null);
      setIsLoading(false);
    }
    
    // Cleanup on unmount
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setError(null);
    try {
      // Remove data URL prefix
      const base64Image = capturedImage.split(',')[1];
      const foods = await getFoodAnalysisFromImage(base64Image, defaultEatMinutes);
      if (foods.length === 0) {
        setError("Could not identify any food items. Please try a clearer picture.");
        setIsLoading(false);
        return;
      }
      onAddFoods(foods);
      onClose();
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-xl font-bold text-white">Analyze Food with AI</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-all transform hover:scale-110"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black relative">
          {cameraError && (
             <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">
                <p className="font-semibold">Camera Error</p>
                <p className="text-sm">{cameraError}</p>
             </div>
          )}
          {!capturedImage && !cameraError && (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
          )}
          {capturedImage && (
            <img src={capturedImage} alt="Captured food" className="w-full h-full object-contain" />
          )}
          {isLoading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                <SparklesIcon className="w-12 h-12 text-amber-400 animate-pulse" />
                <p className="mt-4 text-lg font-semibold">Analyzing image...</p>
                <p className="text-sm text-zinc-300">This may take a moment.</p>
              </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <footer className="p-4 border-t border-zinc-800 flex-shrink-0">
            {error && <div className="text-center text-red-400 bg-red-500/20 p-2 rounded-lg mb-4">{error}</div>}
            <div className="flex items-center justify-center gap-4">
                {!capturedImage ? (
                    <button
                        onClick={handleCapture}
                        disabled={!stream || isLoading}
                        className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-zinc-600 disabled:opacity-50 transition-transform transform hover:scale-105"
                        aria-label="Capture photo"
                    >
                        <div className="w-12 h-12 rounded-full bg-white ring-2 ring-inset ring-black"></div>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleRetake}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-600 transition-colors disabled:opacity-50"
                        >
                            Retake
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 text-zinc-900 font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            <SparklesIcon />
                            Analyze
                        </button>
                    </>
                )}
            </div>
        </footer>
      </div>
    </div>
  );
};

export default CameraAnalysisModal;