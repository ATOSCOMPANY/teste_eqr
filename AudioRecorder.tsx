import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnalysisProvider } from "./contexts/AnalysisContext";
import Dashboard from "./pages/Dashboard";
import PropertyDetail from "./pages/PropertyDetail";
import Loading from "./pages/Loading";
import Settings from "./pages/Settings";
import MatriculaAnalysis from "./pages/MatriculaAnalysis";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/matricula" component={MatriculaAnalysis} />
      <Route path="/loading" component={Loading} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AnalysisProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AnalysisProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
