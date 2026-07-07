import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Vision from './components/Vision';
import Features from './components/Features';
import Roadmap from './components/Roadmap';
import MishkatDashboard from './components/MishkatDashboard';
import Technology from './components/Technology';
import ApiDocs from './components/ApiDocs';
import Investors from './components/Investors';
import Community from './components/Community';
import Footer from './components/Footer';
import DashboardApp from './components/dashboard/DashboardApp';
import LoginPage from './components/dashboard/LoginPage';
import { getStoredSession } from './lib/auth';

function getRoute() {
  if (window.location.hash === '#dashboard') return 'dashboard';
  if (window.location.hash === '#login') return 'login';
  return 'marketing';
}

function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  if (route === 'login') {
    return <LoginPage />;
  }

  if (route === 'dashboard') {
    return getStoredSession() ? <DashboardApp /> : <LoginPage />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A1628' }}>
      <Navbar />
      <Hero />
      <Vision />
      <Features />
      <Roadmap />
      <MishkatDashboard />
      <Technology />
      <ApiDocs />
      <Investors />
      <Community />
      <Footer />
    </div>
  );
}

export default App;
