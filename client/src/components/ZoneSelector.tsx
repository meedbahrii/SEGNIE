import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaveMenu } from '@/contexts/SaveMenuContext';
import { useToast } from '@/hooks/use-toast';

interface ZoneRect {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export function ZoneSelector() {
  const { isZoneSelecting, zoneDestination, cancelZoneSelection, saveToNotion, saveToGoogleSheets } = useSaveMenu();
  const { toast } = useToast();
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoneRect, setZoneRect] = useState<ZoneRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isZoneSelecting) {
      setIsDrawing(false);
      setZoneRect(null);
    }
  }, [isZoneSelecting]);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoneSelecting) return;
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDrawing(true);
    setZoneRect({
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !zoneRect) return;

    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setZoneRect({
      ...zoneRect,
      width: currentX - zoneRect.startX,
      height: currentY - zoneRect.startY,
    });
  };

  const handleMouseUp = async () => {
    if (!isDrawing || !zoneRect) return;
    setIsDrawing(false);

    if (Math.abs(zoneRect.width) < 10 || Math.abs(zoneRect.height) < 10) {
      toast({
        title: "Selection too small",
        description: "Please select a larger area",
        variant: "destructive",
      });
      setZoneRect(null);
      return;
    }

    try {
      const x = zoneRect.width < 0 ? zoneRect.startX + zoneRect.width : zoneRect.startX;
      const y = zoneRect.height < 0 ? zoneRect.startY + zoneRect.height : zoneRect.startY;
      const width = Math.abs(zoneRect.width);
      const height = Math.abs(zoneRect.height);

      toast({
        title: "Capturing zone...",
        description: "Please wait",
      });

      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const zoneCanvas = document.createElement('canvas');
      zoneCanvas.width = width;
      zoneCanvas.height = height;
      const ctx = zoneCanvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          canvas,
          x + window.scrollX,
          y + window.scrollY,
          width,
          height,
          0,
          0,
          width,
          height
        );

        const blob = await new Promise<Blob>((resolve, reject) => {
          zoneCanvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          });
        });

        if (zoneDestination === 'notion') {
          const base64 = await blobToBase64(blob);
          await saveToNotion('zone', base64);
        } else if (zoneDestination === 'google-sheets') {
          const base64 = await blobToBase64(blob);
          await saveToGoogleSheets('zone', base64);
        } else {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `screenshot-zone-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "Zone screenshot saved!",
            description: "Your screenshot has been downloaded",
          });
        }
      }

      cancelZoneSelection();
    } catch (error) {
      console.error('Zone screenshot error:', error);
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the zone",
        variant: "destructive",
      });
    }
  };

  if (!isZoneSelecting) return null;

  const displayRect = zoneRect
    ? {
        left: zoneRect.width < 0 ? zoneRect.startX + zoneRect.width : zoneRect.startX,
        top: zoneRect.height < 0 ? zoneRect.startY + zoneRect.height : zoneRect.startY,
        width: Math.abs(zoneRect.width),
        height: Math.abs(zoneRect.height),
      }
    : null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] cursor-crosshair"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      data-testid="zone-selector-overlay"
    >
      <div className="fixed top-4 right-4 z-[10000]">
        <Button
          variant="secondary"
          size="sm"
          onClick={cancelZoneSelection}
          data-testid="button-cancel-zone"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      {displayRect && (
        <div
          className="absolute border-2 border-primary bg-primary/10"
          style={{
            left: `${displayRect.left}px`,
            top: `${displayRect.top}px`,
            width: `${displayRect.width}px`,
            height: `${displayRect.height}px`,
          }}
          data-testid="zone-selector-rectangle"
        />
      )}

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm border rounded-md px-4 py-2 text-sm">
        Click and drag to select an area to screenshot
      </div>
    </div>
  );
}
