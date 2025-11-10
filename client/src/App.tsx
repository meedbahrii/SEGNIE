import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SaveMenuProvider } from "@/contexts/SaveMenuContext";
import { ZoneSelector } from "@/components/ZoneSelector";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Connections from "@/pages/Connections";
import Subscribe from "@/pages/Subscribe";
import Settings from "@/pages/Settings";
import Demo from "@/pages/Demo";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/demo" component={Demo} />
      <Route path="/about" component={About} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/connections">
        {() => <ProtectedRoute component={Connections} />}
      </Route>
      <Route path="/subscribe">
        {() => <ProtectedRoute component={Subscribe} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SaveMenuProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <ZoneSelector />
          </TooltipProvider>
        </SaveMenuProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
