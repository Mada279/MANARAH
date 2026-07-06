import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Vision from './components/Vision';
import Features from './components/Features';
import Roadmap from './components/Roadmap';
import Technology from './components/Technology';
import ApiDocs from './components/ApiDocs';
import Investors from './components/Investors';
import Community from './components/Community';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen" style={{ background: '#0A1628' }}>
      <Navbar />
      <Hero />
      <Vision />
      <Features />
      <Roadmap />
      <Technology />
      <ApiDocs />
      <Investors />
      <Community />
      <Footer />
    </div>
  );
}

export default App;
