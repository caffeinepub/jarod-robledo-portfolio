import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import About from "./components/About";
import AdminPanel from "./components/AdminPanel";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Portfolio from "./components/Portfolio";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [showAdmin, setShowAdmin] = useState(false);

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <Nav
        isAdmin={isAdmin || false}
        showAdmin={showAdmin}
        onToggleAdmin={() => setShowAdmin((v) => !v)}
      />

      {showAdmin && isAuthenticated && isAdmin ? (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      ) : (
        <main>
          <Hero />
          <Portfolio />
          <About />
          <Contact />
        </main>
      )}

      <Footer />
    </div>
  );
}
