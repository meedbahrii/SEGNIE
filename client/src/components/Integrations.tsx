import { SiGooglesheets, SiNotion } from "react-icons/si";
import { FileText, Plus, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const integrations = [
  { 
    icon: SiGooglesheets, 
    name: "Google Sheets", 
    status: "available", 
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    icon: SiNotion, 
    name: "Notion", 
    status: "available", 
    color: "text-black dark:text-white",
    gradient: "from-gray-700 to-gray-900"
  },
  { 
    icon: FileText, 
    name: "PDF Export", 
    status: "available", 
    color: "text-red-600",
    gradient: "from-red-500 to-rose-500"
  },
  { 
    icon: Plus, 
    name: "Airtable", 
    status: "coming", 
    color: "text-muted-foreground",
    gradient: "from-amber-500 to-yellow-500"
  },
  { 
    icon: Plus, 
    name: "Evernote", 
    status: "coming", 
    color: "text-muted-foreground",
    gradient: "from-green-600 to-lime-500"
  },
  { 
    icon: Plus, 
    name: "OneNote", 
    status: "coming", 
    color: "text-muted-foreground",
    gradient: "from-purple-600 to-indigo-500"
  },
  { 
    icon: Plus, 
    name: "More Apps", 
    status: "coming", 
    color: "text-muted-foreground",
    gradient: "from-blue-500 to-cyan-500"
  }
];

export default function Integrations() {
  return (
    <section className="w-full py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Integrations
          </div>
          <h2 className="text-5xl font-bold tracking-tight" data-testid="text-integrations-title">
            Works With Your
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Favorite Apps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-integrations-subtitle">
            Connect to the tools you already use every day
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <Card 
              key={index} 
              className={`group hover-elevate border-0 glass relative overflow-hidden ${
                integration.status === "coming" ? "opacity-60" : ""
              }`} 
              data-testid={`card-integration-${index}`}
            >
              {integration.status === "available" && (
                <div className={`absolute inset-0 bg-gradient-to-br ${integration.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              )}
              
              <CardContent className="p-8 flex flex-col items-center justify-center space-y-4 min-h-[180px] relative">
                <div className={`w-16 h-16 rounded-2xl ${
                  integration.status === "available" 
                    ? `bg-gradient-to-br ${integration.gradient}` 
                    : "bg-muted"
                } flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                  <integration.icon className={`w-8 h-8 ${
                    integration.status === "available" ? "text-white" : integration.color
                  }`} />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="font-semibold text-lg" data-testid={`text-integration-name-${index}`}>
                    {integration.name}
                  </p>
                  {integration.status === "coming" && (
                    <Badge variant="secondary" className="text-xs glass-strong border-0" data-testid={`badge-coming-soon-${index}`}>
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
