import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { searchFoodByBarcode } from '@/app/api/food/food';
import { FoodItem } from '@/types/food';
import { BrowserMultiFormatReader } from '@zxing/library';

type BarcodeScannerProps = {
  onClose: () => void;
  onFoodFound: (food: FoodItem) => void;
};

export function BarcodeScanner({ onClose, onFoodFound }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    let selectedDeviceId: string | undefined;

    const startScanner = async () => {
      try {
        setScanning(true);
        const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
        selectedDeviceId = videoInputDevices[0].deviceId;

        if (videoRef.current) {
          codeReaderRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
            if (result) {
              handleBarcodeDetected(result.getText());
            }
          });
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please make sure you have granted camera permissions.');
      }
    };

    startScanner();

    return () => {
      codeReaderRef.current.reset();
      setScanning(false);
    };
  }, []);

  const handleBarcodeDetected = async (barcode: string) => {
    try {
      const food = await searchFoodByBarcode(barcode);
      if (food) {
        codeReaderRef.current.reset();  // Stop scanning once food is found
        setScanning(false);
        onFoodFound(food);
      } else {
        setError('No food found for this barcode.');
      }
    } catch (err) {
      console.error('Error searching food by barcode:', err);
      setError('Failed to fetch food data. Please try again.');
    }
  };

  return (
    <div className="inset-0 bg-white z-50 flex flex-col">
      <Button onClick={onClose} className="text-white">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className='relative w-full'>
        <div className="flex-grow flex items-center justify-center pt-2">
          <video ref={videoRef} className="max-w-full max-h-full" playsInline />
        </div>
        {scanning && (
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-primary"
            initial={{ top: '20%' }}
            animate={{ top: ['20%', '80%', '20%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
