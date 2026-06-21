import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SignatureCarousel from '../components/SignatureCarousel';
import SpecialsCarousel from '../components/SpecialsCarousel';
import BrandStory from '../components/BrandStory';
import HomeGallery from '../components/home/HomeGallery';
import Testimonials from '../components/Testimonials';
import CompactVisitUs from '../components/home/compact-visit-us';
import IzGrabPromo from '../components/home/IzGrabPromo';
import { getPublishedLocations } from '../lib/locations/getLocations';
import { getHomeContent } from '../lib/site/getHomeContent';
import { getNavigationSettings } from '../lib/site/getNavigationSettings';
import { Location, SiteContent } from '../types';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [izGrabLink, setIzGrabLink] = useState<{ href: string; enabled: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [locationsData, contentData, navData] = await Promise.all([
          getPublishedLocations(),
          getHomeContent(),
          getNavigationSettings()
        ]);
        
        if (mounted) {
          setLocations(locationsData);
          setSiteContent(contentData);
          const grabItem = navData.find(item => item.id === 'iz-grab');
          if (grabItem) {
            setIzGrabLink({ href: grabItem.href, enabled: grabItem.enabled });
          }
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
      {izGrabLink?.enabled && <IzGrabPromo url={izGrabLink.href} />}
      <BrandStory content={siteContent} />
      <HomeGallery />
      <Testimonials />
      <CompactVisitUs locations={locations} loading={loading} />
    </main>
  );
}

