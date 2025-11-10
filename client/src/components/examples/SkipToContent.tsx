import SkipToContent from '../SkipToContent';

export default function SkipToContentExample() {
  return (
    <div className="relative h-32 border rounded-md">
      <SkipToContent />
      <div className="p-4 text-muted-foreground text-sm">
        Tab to focus the "Skip to content" link (it will appear when focused)
      </div>
    </div>
  );
}
