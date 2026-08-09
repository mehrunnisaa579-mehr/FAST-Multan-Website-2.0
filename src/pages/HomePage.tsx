import Hero from '../components/home/Hero';
import DirectorMessage from '../components/home/DirectorMessage';
import OurSchools from '../components/home/OurSchools';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PhotoGallery from '../components/home/PhotoGallery';
import NewsAnnouncements from '../components/home/NewsAnnouncements';
import UpcomingEvents from '../components/home/UpcomingEvents';
import CampusHighlights from '../components/home/CampusHighlights';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <DirectorMessage />
      <OurSchools />
      <WhyChooseUs />
      <PhotoGallery />
      <NewsAnnouncements />
      <UpcomingEvents />
      <CampusHighlights />
    </div>
  );
}
