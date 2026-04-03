import Hero from '../components/Hero';
import SignatureProducts from '../components/SignatureProducts';
import BrandStory from '../components/BrandStory';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import ReservationContact from '../components/ReservationContact';

export default function Home() {
  return (
    <main>
      <Hero />
      <SignatureProducts />
      <BrandStory />
      <Gallery />
      <Testimonials />
      <ReservationContact />
    </main>
  );
}
