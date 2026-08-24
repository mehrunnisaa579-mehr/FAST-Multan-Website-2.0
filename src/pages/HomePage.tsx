import { useEffect, useState } from 'react';
import { cmsService } from '../services/cmsService';
import ViewportObserver from '../components/ui/ViewportObserver';

import Hero from '../components/home/Hero';
import DirectorMessage from '../components/home/DirectorMessage';
import OurSchools from '../components/home/OurSchools';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CampusTour from '../components/home/CampusTour';
import EventsAndNews from '../components/home/EventsAndNews';
import PhotoGallery from '../components/home/PhotoGallery';

export default function HomePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      const result = await cmsService.getSetting<any>('homepage_full_content', null);
      if (result) {
        setData(result);
      }
    };
    fetchHomepageData();
  }, []);

  return (
    <div>
      <Hero data={data} />
      <DirectorMessage data={data} />
      
      <ViewportObserver height="400px">
        <OurSchools data={data} />
      </ViewportObserver>

      <ViewportObserver height="400px">
        <WhyChooseUs data={data} />
      </ViewportObserver>

      <ViewportObserver height="700px">
        <CampusTour data={data} />
      </ViewportObserver>

      <ViewportObserver height="700px">
        <EventsAndNews data={data} />
      </ViewportObserver>

      <ViewportObserver height="750px">
        <PhotoGallery data={data} />
      </ViewportObserver>
    </div>
  );
}
