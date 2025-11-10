import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, Zap } from "lucide-react";

export default function Analytics() {
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['/api/activity/me'],
  });

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/saved-items'],
  });

  const activity = activityData?.activity || [];
  const items = itemsData?.items || [];
  const isLoading = activityLoading || itemsLoading;

  const stats = {
    totalSaves: items.length,
    thisWeek: items.filter((item: any) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(item.createdAt) >= weekAgo;
    }).length,
    thisMonth: items.filter((item: any) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(item.createdAt) >= monthAgo;
    }).length,
    recentActivity: activity.length,
  };

  const contentTypeBreakdown = items.reduce((acc: any, item: any) => {
    acc[item.contentType] = (acc[item.contentType] || 0) + 1;
    return acc;
  }, {});

  const destinationBreakdown = items.reduce((acc: any, item: any) => {
    Object.keys(item.destinations || {}).forEach(dest => {
      acc[dest] = (acc[dest] || 0) + 1;
    });
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Track your saving habits and usage patterns</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-analytics-title">Analytics</h1>
          <p className="text-muted-foreground">Track your saving habits and usage patterns</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saves</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-saves">{stats.totalSaves}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-week-saves">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-month-saves">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-recent-activity">{stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                Actions logged
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Content Types</CardTitle>
              <CardDescription>Breakdown of what you save</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(contentTypeBreakdown).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No data yet</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(contentTypeBreakdown).map(([type, count]: [string, any]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" data-testid={`badge-content-type-${type}`}>
                          {type}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium" data-testid={`text-count-${type}`}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
              <CardDescription>Where you save your content</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(destinationBreakdown).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No data yet</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(destinationBreakdown).map(([dest, count]: [string, any]) => (
                    <div key={dest} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" data-testid={`badge-destination-${dest}`}>
                          {dest}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium" data-testid={`text-dest-count-${dest}`}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No activity yet</div>
            ) : (
              <div className="space-y-2">
                {activity.slice(0, 20).map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover-elevate"
                    data-testid={`activity-${log.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
