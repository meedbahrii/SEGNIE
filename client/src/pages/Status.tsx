import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Activity, Clock } from "lucide-react";

const services = [
  { name: "API", status: "operational", uptime: "99.99%" },
  { name: "Browser Extension", status: "operational", uptime: "99.98%" },
  { name: "Dashboard", status: "operational", uptime: "99.97%" },
  { name: "Notion Integration", status: "operational", uptime: "99.95%" },
  { name: "Google Sheets Integration", status: "operational", uptime: "99.96%" },
  { name: "Stripe Payments", status: "operational", uptime: "100%" }
];

const incidents = [
  {
    date: "2024-03-15",
    title: "Resolved: API Response Times",
    description: "We experienced slightly elevated API response times due to increased traffic. Issue was resolved by scaling infrastructure.",
    status: "resolved",
    duration: "45 minutes"
  },
  {
    date: "2024-03-01",
    title: "Scheduled Maintenance",
    description: "Performed routine database maintenance and security updates. All services were temporarily unavailable.",
    status: "maintenance",
    duration: "2 hours"
  },
  {
    date: "2024-02-20",
    title: "Resolved: Extension Sync Delay",
    description: "Some users experienced delays in syncing saved items. The issue was caused by a caching layer and has been resolved.",
    status: "resolved",
    duration: "1 hour 15 minutes"
  }
];

const upcomingMaintenance = [
  {
    date: "2024-04-01",
    time: "02:00 - 04:00 UTC",
    title: "Database Optimization",
    description: "Scheduled maintenance to optimize database performance. Brief service interruption expected."
  }
];

export default function Status() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h1 className="text-4xl font-bold">All Systems Operational</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Current status of all Segnie services and infrastructure
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Service Status
              </CardTitle>
              <CardDescription>Real-time status of all services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-md border"
                    data-testid={`service-status-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.uptime} uptime (30 days)
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                      data-testid={`badge-operational-${index}`}
                    >
                      Operational
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Recent Incidents
                </CardTitle>
                <CardDescription>Past issues and resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident, index) => (
                    <div key={index} className="space-y-2 pb-4 border-b last:border-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm" data-testid={`incident-title-${index}`}>
                            {incident.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {incident.date} • {incident.duration}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            incident.status === "resolved" 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }
                          data-testid={`badge-incident-status-${index}`}
                        >
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {incident.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming Maintenance
                </CardTitle>
                <CardDescription>Scheduled maintenance windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMaintenance.map((maintenance, index) => (
                    <div key={index} className="space-y-2 p-4 rounded-md border" data-testid={`maintenance-${index}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{maintenance.title}</p>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {maintenance.date} • {maintenance.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {maintenance.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold">Subscribe to Status Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about incidents and maintenance via email
                </p>
                <div className="flex gap-2 max-w-md mx-auto mt-4">
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    data-testid="input-status-subscribe"
                  />
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    data-testid="button-subscribe-status"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
