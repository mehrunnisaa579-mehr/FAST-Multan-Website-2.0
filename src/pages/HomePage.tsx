import Hero from '../components/home/Hero';
import DirectorMessage from '../components/home/DirectorMessage';
import OurSchools from '../components/home/OurSchools';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CampusTour from '../components/home/CampusTour';
import EventsAndNews from '../components/home/EventsAndNews';
import PhotoGallery from '../components/home/PhotoGallery';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <DirectorMessage />
      <OurSchools />
      <WhyChooseUs />
      <CampusTour />
      <EventsAndNews />
      <PhotoGallery />
    </div>
  );
}
