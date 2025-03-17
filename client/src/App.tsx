import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import SplashScreen from "@/pages/splash";
import Login from "@/pages/login";
import HomePage from "@/pages/home";
import ProfilePage from "@/pages/profile";
import RoadmapPage from "@/pages/roadmap";
import "./global.css";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/login" component={Login} />
      <Route path="/home" component={HomePage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/roadmap/:id" component={RoadmapPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
