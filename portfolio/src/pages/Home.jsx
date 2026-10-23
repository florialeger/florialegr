import HeroSection from '@/components/sections/HeroSection';
import pageLayout from '@/components/ui/PageLayout.module.css';

const Home = () => {
  return (
    <div className={pageLayout.page} style={{ paddingTop: 0 }}>
      <HeroSection />
    </div>
  );
};

export default Home;
