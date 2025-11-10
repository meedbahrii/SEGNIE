import { Card } from "@/components/ui/card";

interface AdPlacementProps {
  slot: string;
  format?: "horizontal" | "vertical" | "square" | "auto";
  className?: string;
}

export default function AdPlacement({ slot, format = "auto", className = "" }: AdPlacementProps) {
  const formatClasses = {
    horizontal: "min-h-[90px] md:min-h-[90px]",
    vertical: "min-h-[600px]",
    square: "min-h-[250px]",
    auto: "min-h-[100px] md:min-h-[250px]"
  };

  return (
    <Card 
      className={`bg-muted/30 border-dashed flex items-center justify-center ${formatClasses[format]} ${className}`}
      data-testid={`ad-placement-${slot}`}
    >
      <div className="text-center p-4">
        <p className="text-sm text-muted-foreground font-medium">Advertisement</p>
        <p className="text-xs text-muted-foreground mt-1">
          {slot}
        </p>
      </div>
    </Card>
  );
}
