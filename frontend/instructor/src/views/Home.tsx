import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Stats } from '../components/Stats';
import { HowItWorks } from '../components/HowItWorks';
import { GamificationRanks } from '../components/GamificationRanks';
import { IntegritySection } from '../components/IntegritySection';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';

export const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    <Features />
                </div>
                <Stats />
                <HowItWorks />
                <GamificationRanks />
                <IntegritySection />
                <Testimonials />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
};
