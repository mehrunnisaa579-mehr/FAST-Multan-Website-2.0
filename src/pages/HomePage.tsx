import Hero from '../components/home/Hero';
import DirectorMessage from '../components/home/DirectorMessage';
import OurSchools from '../components/home/OurSchools';
import CampusTour from '../components/home/CampusTour';
import EventsAndNews from '../components/home/EventsAndNews';
import PhotoGallery from '../components/home/PhotoGallery';
import WhyChooseUs from '../components/home/WhyChooseUs';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <DirectorMessage />
      <OurSchools />
      <CampusTour />
      <EventsAndNews />
      <PhotoGallery />
      <WhyChooseUs />
    </div>
  );
}
