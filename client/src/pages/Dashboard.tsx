import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Search, Plus, LogOut, User, Sparkles, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { SiGooglesheets, SiNotion } from "react-icons/si";
import { FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import OnboardingFlow from "@/components/OnboardingFlow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SavedItem, IntegrationConnection } from "@shared/schema";

interface SavedItemsResponse {
  items: SavedItem[];
}

interface IntegrationsResponse {
  connections: IntegrationConnection[];
}

const integrationIcons: Record<string, any> = {
  "google-sheets": SiGooglesheets,
  "notion": SiNotion,
  "pdf": FileText,
};

const integrationGradients: Record<string, string> = {
  "google-sheets": "from-green-500 to-emerald-500",
  "notion": "from-gray-700 to-gray-900",
  "pdf": "from-red-500 to-rose-500",
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const { data: savedItemsData, isLoading: itemsLoading } = useQuery<SavedItemsResponse>({
    queryKey: ["/api/saved-items"],
  });

  const { data: integrationsData, isLoading: integrationsLoading } = useQuery<IntegrationsResponse>({
    queryKey: ["/api/integrations"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/saved-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-items"] });
      toast({
        title: "Deleted",
        description: "Item removed successfully.",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation("/login");
    },
  });

  const savedItems: SavedItem[] = savedItemsData?.items || [];
  const integrations: IntegrationConnection[] = integrationsData?.connections || [];

  const filteredItems = savedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || item.contentType === selectedType;
    return matchesSearch && matchesType;
  });

  const contentTypes = Array.from(new Set(savedItems.map(item => item.contentType)));

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-mesh fixed inset-0 opacity-30"></div>
      
      <header className="relative border-b glass-strong">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
                <p className="text-sm text-muted-foreground" data-testid="text-dashboard-subtitle">
                  {savedItems.length} saved items
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => setLocation('/connections')} data-testid="button-add-integration">
                <Plus className="w-4 h-4 mr-2" />
                Connections
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="glass-strong border-0" data-testid="button-user-menu">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong border-0">
                  <DropdownMenuLabel data-testid="text-user-username">
                    {user?.username}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/settings")} data-testid="button-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <Card className="border-0 glass">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold" data-testid="text-integrations-title">Integrations</h2>
                  <Badge className="glass-strong border-0 text-xs">{integrations.length}</Badge>
                </div>
                
                <div className="space-y-3">
                  {integrationsLoading ? (
                    <>
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass animate-pulse">
                          <div className="w-10 h-10 bg-muted rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-muted rounded w-3/4" />
                            <div className="h-2 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : integrations.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No integrations connected
                    </div>
                  ) : (
                    integrations.map((integration) => {
                      const Icon = integrationIcons[integration.integrationType] || FileText;
                      const gradient = integrationGradients[integration.integrationType] || "from-gray-500 to-gray-700";
                      return (
                        <div
                          key={integration.id}
                          className="flex items-center gap-3 p-3 rounded-xl glass-strong border-0 hover-elevate"
                          data-testid={`integration-${integration.id}`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {integration.accountName}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {integration.integrationType.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 glass">
              <CardContent className="p-6 space-y-3">
                <h2 className="font-semibold mb-4" data-testid="text-filter-title">Filters</h2>
                <Button
                  variant={selectedType === null ? "default" : "ghost"}
                  className={`w-full justify-start ${selectedType === null ? '' : 'glass-strong border-0'}`}
                  size="sm"
                  onClick={() => setSelectedType(null)}
                  data-testid="button-filter-all"
                >
                  All Items
                </Button>
                {contentTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "ghost"}
                    className={`w-full justify-start ${selectedType === type ? '' : 'glass-strong border-0'}`}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    data-testid={`button-filter-${type}`}
                  >
                    <span className="capitalize">{type}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <Card className="border-0 glass">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search saved items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-0 glass-strong"
                    data-testid="input-search"
                  />
                </div>
              </CardContent>
            </Card>

            {itemsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-0 glass">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-xl animate-pulse" />
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                          <div className="h-4 bg-muted rounded w-full animate-pulse" />
                          <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <Card className="border-0 glass">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground" data-testid="text-no-items">
                    {searchQuery || selectedType
                      ? "No items match your filters"
                      : "No saved items yet. Install the browser extension to start saving!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="group border-0 glass hover-elevate" data-testid={`card-item-${item.id}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-28 h-28 object-cover rounded-xl"
                              data-testid={`img-item-${item.id}`}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2" data-testid={`text-title-${item.id}`}>
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid={`text-content-${item.id}`}>
                                {item.content}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.sourceUrl && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="glass-strong border-0"
                                  asChild
                                  data-testid={`button-source-${item.id}`}
                                >
                                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="glass-strong border-0"
                                onClick={() => deleteMutation.mutate(item.id)}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="glass-strong border-0" data-testid={`badge-type-${item.id}`}>
                                {item.contentType}
                              </Badge>
                              {item.tags?.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="glass-strong border-0" data-testid={`badge-tag-${item.id}-${idx}`}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground" data-testid={`text-date-${item.id}`}>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-2">
                                {typeof item.destinations === 'object' && item.destinations !== null && 
                                 Object.keys(item.destinations).map((dest, idx) => {
                                   const Icon = integrationIcons[dest] || FileText;
                                   const gradient = integrationGradients[dest] || "from-gray-500 to-gray-700";
                                   return (
                                     <div
                                       key={idx}
                                       className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
                                       data-testid={`icon-destination-${item.id}-${idx}`}
                                     >
                                       <Icon className="w-4 h-4 text-white" />
                                     </div>
                                   );
                                 })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      
      <footer className="w-full border-t bg-muted/20 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Developed by{" "}
            <a 
              href="https://www.linkedin.com/in/bahrimeed/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
              data-testid="link-developer-dashboard"
            >
              Mohammed Bahri
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
