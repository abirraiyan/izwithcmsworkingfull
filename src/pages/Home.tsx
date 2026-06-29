import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SignatureCarousel from '../components/SignatureCarousel';
import SpecialsCarousel from '../components/SpecialsCarousel';
import BrandStory from '../components/BrandStory';
import HomeGallery from '../components/home/HomeGallery';
import Testimonials from '../components/Testimonials';
import CompactVisitUs from '../components/home/compact-visit-us';
import { getPublishedLocations } from '../lib/locations/getLocations';
import { getHomeContent } from '../lib/site/getHomeContent';
import { Location, SiteContent } from '../types';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [locationsData, contentData] = await Promise.all([
          getPublishedLocations(),
          getHomeContent()
        ]);
        
        if (mounted) {
          setLocations(locationsData);
          setSiteContent(contentData);
        }
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <Hero content={siteContent} />
      <SignatureCarousel />
      <SpecialsCarousel />
      <BrandStory content={siteContent} />
      <HomeGallery />
      <Testimonials />
      <CompactVisitUs locations={locations} loading={loading} />
    </main>
  );
}

