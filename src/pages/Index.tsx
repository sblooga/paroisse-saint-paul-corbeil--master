import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import MassSchedule from '@/components/MassSchedule';
import FeaturedArticles from '@/components/FeaturedArticles';
import TeamSection from '@/components/TeamSection';
import DonationCTA from '@/components/DonationCTA';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlider />
        <MassSchedule />
        <FeaturedArticles />
        <TeamSection />
        <DonationCTA />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
