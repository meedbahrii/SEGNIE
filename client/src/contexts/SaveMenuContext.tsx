import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

type Destination = 'notion' | 'google-sheets' | 'pdf' | 'download';

interface SaveMenuContextType {
  captureFullPageScreenshot: () => Promise<void>;
  captureZoneScreenshot: (destination?: Destination) => void;
  saveToPDF: () => Promise<void>;
  saveToNotion: (type: 'page' | 'screenshot' | 'zone', data?: string) => Promise<void>;
  saveToGoogleSheets: (type: 'page' | 'screenshot' | 'zone', data?: string) => Promise<void>;
  captureAndSaveToNotion: (type: 'screenshot' | 'zone') => Promise<void>;
  captureAndSaveToGoogleSheets: (type: 'screenshot' | 'zone') => Promise<void>;
  isZoneSelecting: boolean;
  zoneDestination: Destination | null;
  cancelZoneSelection: () => void;
}

const SaveMenuContext = createContext<SaveMenuContextType | undefined>(undefined);

export function SaveMenuProvider({ children }: { children: ReactNode }) {
  const [isZoneSelecting, setIsZoneSelecting] = useState(false);
  const [zoneDestination, setZoneDestination] = useState<Destination | null>(null);
  const { toast } = useToast();

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const captureFullPageScreenshot = useCallback(async () => {
    try {
      toast({
        title: "Capturing screenshot...",
        description: "Please wait while we capture the page",
      });

      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `screenshot-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "Screenshot saved!",
            description: "Your screenshot has been downloaded",
          });
        }
      });
    } catch (error) {
      console.error('Screenshot error:', error);
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot",
        variant: "destructive",
      });
    }
  }, [toast]);

  const captureAndSaveToNotion = useCallback(async (type: 'screenshot' | 'zone') => {
    try {
      toast({
        title: "Capturing screenshot...",
        description: "Please wait while we capture the page",
      });

      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        });
      });

      const base64 = await blobToBase64(blob);

      await saveToNotion('screenshot', base64);
    } catch (error) {
      console.error('Screenshot and save error:', error);
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot",
        variant: "destructive",
      });
    }
  }, [toast]);

  const captureAndSaveToGoogleSheets = useCallback(async (type: 'screenshot' | 'zone') => {
    try {
      toast({
        title: "Capturing screenshot...",
        description: "Please wait while we capture the page",
      });

      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        });
      });

      const base64 = await blobToBase64(blob);

      await saveToGoogleSheets('screenshot', base64);
    } catch (error) {
      console.error('Screenshot and save error:', error);
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot",
        variant: "destructive",
      });
    }
  }, [toast]);

  const captureZoneScreenshot = useCallback((destination: Destination = 'download') => {
    setIsZoneSelecting(true);
    setZoneDestination(destination);
  }, []);

  const cancelZoneSelection = useCallback(() => {
    setIsZoneSelecting(false);
    setZoneDestination(null);
  }, []);

  const saveToPDF = useCallback(async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your PDF",
      });

      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`page-${Date.now()}.pdf`);

      toast({
        title: "PDF saved!",
        description: "Your PDF has been downloaded",
      });
    } catch (error) {
      console.error('PDF error:', error);
      toast({
        title: "PDF generation failed",
        description: "There was an error creating the PDF",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveToNotion = useCallback(async (type: 'page' | 'screenshot' | 'zone', data?: string) => {
    try {
      toast({
        title: "Saving to Notion...",
        description: "This feature requires Notion integration setup",
      });

      const response = await fetch('/api/save/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type,
          data: data || document.title,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save to Notion');
      }

      toast({
        title: "Saved to Notion!",
        description: "Content has been saved to your Notion workspace",
      });
    } catch (error: any) {
      console.error('Notion save error:', error);
      toast({
        title: "Save to Notion failed",
        description: error.message || "Please ensure your Notion integration is configured",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveToGoogleSheets = useCallback(async (type: 'page' | 'screenshot' | 'zone', data?: string) => {
    try {
      toast({
        title: "Saving to Google Sheets...",
        description: "This feature requires Google Sheets integration setup",
      });

      const response = await fetch('/api/save/google-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type,
          data: data || document.title,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save to Google Sheets');
      }

      toast({
        title: "Saved to Google Sheets!",
        description: "Content has been saved to your spreadsheet",
      });
    } catch (error: any) {
      console.error('Google Sheets save error:', error);
      toast({
        title: "Save to Google Sheets failed",
        description: error.message || "Please ensure your Google Sheets integration is configured",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <SaveMenuContext.Provider
      value={{
        captureFullPageScreenshot,
        captureZoneScreenshot,
        saveToPDF,
        saveToNotion,
        saveToGoogleSheets,
        captureAndSaveToNotion,
        captureAndSaveToGoogleSheets,
        isZoneSelecting,
        zoneDestination,
        cancelZoneSelection,
      }}
    >
      {children}
    </SaveMenuContext.Provider>
  );
}

export function useSaveMenu() {
  const context = useContext(SaveMenuContext);
  if (!context) {
    throw new Error('useSaveMenu must be used within SaveMenuProvider');
  }
  return context;
}
