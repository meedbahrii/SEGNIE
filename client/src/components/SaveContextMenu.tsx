import { FileText, Image, Crop, FileDown } from 'lucide-react';
import { SiNotion as NotionIcon, SiGooglesheets as GoogleSheetsIcon } from 'react-icons/si';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useSaveMenu } from '@/contexts/SaveMenuContext';

interface SaveContextMenuProps {
  children: React.ReactNode;
}

export function SaveContextMenu({ children }: SaveContextMenuProps) {
  const {
    captureFullPageScreenshot,
    captureZoneScreenshot,
    saveToPDF,
    saveToNotion,
    saveToGoogleSheets,
    captureAndSaveToNotion,
    captureAndSaveToGoogleSheets,
  } = useSaveMenu();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild data-testid="context-menu-trigger">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64" data-testid="context-menu-content">
        <ContextMenuSub>
          <ContextMenuSubTrigger data-testid="menu-notion">
            <NotionIcon className="mr-2 h-4 w-4" />
            <span>Save to Notion</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <ContextMenuItem
              onClick={() => saveToNotion('page')}
              data-testid="notion-save-page"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Save Page</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={async () => {
                await captureAndSaveToNotion('screenshot');
              }}
              data-testid="notion-full-screenshot"
            >
              <Image className="mr-2 h-4 w-4" />
              <span>Take Full Page Screenshot</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                captureZoneScreenshot('notion');
              }}
              data-testid="notion-zone-screenshot"
            >
              <Crop className="mr-2 h-4 w-4" />
              <span>Select Zone to Screenshot</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger data-testid="menu-google-sheets">
            <GoogleSheetsIcon className="mr-2 h-4 w-4" />
            <span>Save to Google Sheets</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <ContextMenuItem
              onClick={() => saveToGoogleSheets('page')}
              data-testid="sheets-save-page"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Save Page</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={async () => {
                await captureAndSaveToGoogleSheets('screenshot');
              }}
              data-testid="sheets-full-screenshot"
            >
              <Image className="mr-2 h-4 w-4" />
              <span>Take Full Page Screenshot</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                captureZoneScreenshot('google-sheets');
              }}
              data-testid="sheets-zone-screenshot"
            >
              <Crop className="mr-2 h-4 w-4" />
              <span>Select Zone to Screenshot</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger data-testid="menu-pdf">
            <FileDown className="mr-2 h-4 w-4" />
            <span>Save to PDF</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <ContextMenuItem
              onClick={saveToPDF}
              data-testid="pdf-save-page"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Save Page</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={async () => {
                await captureFullPageScreenshot();
              }}
              data-testid="pdf-full-screenshot"
            >
              <Image className="mr-2 h-4 w-4" />
              <span>Take Full Page Screenshot</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                captureZoneScreenshot();
              }}
              data-testid="pdf-zone-screenshot"
            >
              <Crop className="mr-2 h-4 w-4" />
              <span>Select Zone to Screenshot</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
