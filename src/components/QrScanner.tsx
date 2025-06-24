// src/components/QrScanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type QrScannerProps = {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (errorMessage: string) => void;
};

const QrScanner: React.FC<QrScannerProps> = ({
  onScanSuccess,
  onScanFailure,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const divId = "qr-reader";

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      divId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        if (onScanFailure) onScanFailure(errorMessage);
      }
    );

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id={divId} />;
};

export default QrScanner;
