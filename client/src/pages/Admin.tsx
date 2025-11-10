import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, Activity, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  isPremium: boolean;
  planType: string;
  saveCount: number;
  isAdmin: boolean;
  createdAt: string;
  lastLoginAt?: string;
};

type ActivityLog = {
  id: string;
  userId?: string;
  action: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
};

export default function Admin() {
  const { toast } = useToast();

  const { data: statsData } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['/api/admin/activity'],
  });

  const upgradeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/upgrade`);
      if (!res.ok) throw new Error("Failed to upgrade user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Success",
        description: "User upgraded to premium",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upgrade user",
        variant: "destructive",
      });
    },
  });

  const downgradeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/downgrade`);
      if (!res.ok) throw new Error("Failed to downgrade user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Success",
        description: "User downgraded to free",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to downgrade user",
        variant: "destructive",
      });
    },
  });

  const stats = statsData?.stats || {
    totalUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    newUsersToday: 0,
    estimatedMonthlyRevenue: 0,
  };

  const users: User[] = usersData?.users || [];
  const activity: ActivityLog[] = activityData?.activity || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="text-admin-title">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users and monitor system activity</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-users">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersToday} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-premium-users">{stats.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}% conversion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-free-users">{stats.freeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Active accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-revenue">${stats.estimatedMonthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Estimated MRR
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Saves</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {user.username}
                                {user.isAdmin && (
                                  <Badge variant="secondary" data-testid={`badge-admin-${user.id}`}>Admin</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isPremium ? "default" : "outline"} data-testid={`badge-plan-${user.id}`}>
                                {user.isPremium ? "Premium" : "Free"}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.saveCount}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {!user.isPremium ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => upgradeMutation.mutate(user.id)}
                                    disabled={upgradeMutation.isPending}
                                    data-testid={`button-upgrade-${user.id}`}
                                  >
                                    <ArrowUpCircle className="h-4 w-4 mr-1" />
                                    Upgrade
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downgradeMutation.mutate(user.id)}
                                    disabled={downgradeMutation.isPending}
                                    data-testid={`button-downgrade-${user.id}`}
                                  >
                                    <ArrowDownCircle className="h-4 w-4 mr-1" />
                                    Downgrade
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>System-wide activity logs and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading activity...</div>
                ) : activity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No activity found</div>
                ) : (
                  <div className="space-y-2">
                    {activity.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover-elevate"
                        data-testid={`activity-${log.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{log.action.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleString()}
                              {log.ipAddress && ` • ${log.ipAddress}`}
                            </p>
                          </div>
                        </div>
                        {log.details && (
                          <Badge variant="outline">Details</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
