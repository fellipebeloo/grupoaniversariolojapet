import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import FunnelPage from "./pages/Funnel";
import GroupTestPage from "./pages/GroupTestPage";
import PitchTestPage from "./pages/PitchTestPage";
import AffiliateLeadPage from "./pages/AffiliateLeadPage"; // Importar a nova página

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FunnelPage />} /> {/* FunnelPage agora é a rota padrão */}
          <Route path="/funil" element={<FunnelPage />} />
          <Route path="/grupo-teste" element={<GroupTestPage />} />
          <Route path="/pitch-teste" element={<PitchTestPage />} />
          <Route path="/afiliados" element={<AffiliateLeadPage />} /> {/* Nova rota para captação de afiliados */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;