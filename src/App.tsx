import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Index from "./pages/Index";
import SnackDetail from "./pages/SnackDetail";
import GoVegan from "./pages/GoVegan";
import About from "./pages/About";
import JoinUs from "./pages/JoinUs";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/landing";

  return (
    <>
      {!isLanding && <Header />}
      <main className={!isLanding ? "pt-24 md:pt-28" : ""}>
        <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Index />} />
        <Route path="/snack/:slug" element={<SnackDetail />} />
        <Route path="/go-vegan" element={<GoVegan />} />
        <Route path="/about" element={<About />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
