import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Stats } from '../components/Stats';
import { HowItWorks } from '../components/HowItWorks';
import { BotScanner } from '../components/BotScanner';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { CTA } from '../components/CTA';
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
                <BotScanner />
                <Testimonials />
                <Pricing />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};
