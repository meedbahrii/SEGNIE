import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IntegrationConnection } from "@shared/schema";

interface IntegrationsResponse {
  connections: IntegrationConnection[];
}

interface SaveLimitResponse {
  saveCount: number;
  limit: number;
  remaining: number;
  isPremium: boolean;
  canSave: boolean;
}

export default function Connections() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: integrationsData, isLoading: integrationsLoading } = useQuery<IntegrationsResponse>({
    queryKey: ["/api/integrations"],
  });

  const { data: saveLimitData } = useQuery<SaveLimitResponse>({
    queryKey: ["/api/user/save-limit"],
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/integrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Connection removed",
        description: "Integration connection has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove connection.",
        variant: "destructive",
      });
    },
  });

  const connectIntegration = async (service: string) => {
    try {
      const response = await fetch(`/api/oauth/${service}/auth`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.authUrl) {
          window.location.href = data.authUrl;
        } else if (data.redirect) {
          queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
          toast({
            title: "Connected",
            description: data.message || "Integration connected successfully.",
          });
          window.location.href = data.redirect;
        } else if (data.success) {
          queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
          toast({
            title: "Connected",
            description: data.message || "Integration connected successfully.",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to initiate connection.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect integration.",
        variant: "destructive",
      });
    }
  };

  const integrations = [
    { id: 'notion', name: 'Notion', icon: '📝', description: 'Save to your Notion workspace' },
    { id: 'google-sheets', name: 'Google Sheets', icon: '📊', description: 'Save to Google Spreadsheets' },
  ];

  const connections = integrationsData?.connections || [];
  const connectedTypes = new Set(connections.map(c => c.integrationType));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-connections-title">Manage Connections</h1>
              <p className="text-sm text-muted-foreground" data-testid="text-connections-subtitle">
                Connect your favorite apps to save content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="default" onClick={() => window.location.href = '/dashboard'} data-testid="button-back-dashboard">
                Back to Dashboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-user-menu">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel data-testid="text-user-username">
                    {user?.username}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
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

      <div className="container mx-auto px-4 py-8">
        {saveLimitData && !saveLimitData.isPremium && (
          <Card className="mb-6 border-primary">
            <CardHeader>
              <CardTitle className="text-lg" data-testid="text-free-plan-title">Free Plan</CardTitle>
              <CardDescription data-testid="text-free-plan-description">
                You have {saveLimitData.remaining} of {saveLimitData.limit} saves remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" onClick={() => window.location.href = '/subscribe'} data-testid="button-upgrade">
                Upgrade to Premium for Unlimited Saves
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const connection = connections.find(c => c.integrationType === integration.id);
            const isConnected = connectedTypes.has(integration.id);

            return (
              <Card key={integration.id} data-testid={`card-integration-${integration.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-integration-name-${integration.id}`}>
                          {integration.name}
                        </CardTitle>
                        <CardDescription data-testid={`text-integration-desc-${integration.id}`}>
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-2">
                    {isConnected ? (
                      <>
                        <Badge variant="default" data-testid={`badge-connected-${integration.id}`}>
                          Connected
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => connection && deleteConnectionMutation.mutate(connection.id)}
                          disabled={deleteConnectionMutation.isPending}
                          data-testid={`button-disconnect-${integration.id}`}
                        >
                          {deleteConnectionMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Disconnect
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => connectIntegration(integration.id)}
                        data-testid={`button-connect-${integration.id}`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Connect {integration.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {connections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4" data-testid="text-active-connections">
              Active Connections
            </h2>
            <div className="space-y-3">
              {connections.map((conn) => (
                <Card key={conn.id} data-testid={`card-connection-${conn.id}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium" data-testid={`text-connection-account-${conn.id}`}>
                        {conn.accountName}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-connection-type-${conn.id}`}>
                        {conn.integrationType}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteConnectionMutation.mutate(conn.id)}
                      disabled={deleteConnectionMutation.isPending}
                      data-testid={`button-remove-${conn.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {integrationsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="w-12 h-12 bg-muted rounded-lg animate-pulse mb-3" />
                  <div className="h-6 bg-muted rounded w-3/4 animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
