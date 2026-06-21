import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { SiteContent } from "../types";
import { useState, useEffect } from "react";
import { getNavigationSettings } from "../lib/site/getNavigationSettings";

interface HeroProps {
  content?: SiteContent | null;
}

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) {
    if (!url.includes('autoplay=')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playsinline=1&disablekb=1`;
    }
    return url;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&playsinline=1&disablekb=1`;
  }
  return null;
}

export default function Hero({ content }: HeroProps) {
  const [izGrabLink, setIzGrabLink] = useState<{ href: string; enabled: boolean } | null>(null);

  useEffect(() => {
    const loadNav = async () => {
      try {
        const data = await getNavigationSettings();
        const grabItem = data.find(item => item.id === 'iz-grab');
        if (grabItem) {
          setIzGrabLink({ href: grabItem.href, enabled: grabItem.enabled });
        }
      } catch (err) {
        console.warn("Failed to load hero nav link:", err);
      }
    };
    loadNav();
  }, []);

  const isCustomEnabled = content?.hero_enabled === 'true';

  const defaultVideoUrl = "https://www.youtube.com/embed/Dg9tw8p_fn0?autoplay=1&mute=1&loop=1&playlist=Dg9tw8p_fn0&controls=0&showinfo=0&rel=0&playsinline=1&disablekb=1";

  const hero = {
    videoUrl: isCustomEnabled ? (content?.hero_video_url || defaultVideoUrl) : defaultVideoUrl,
    posterUrl: isCustomEnabled ? (content?.hero_poster_url || '') : '',
    badgeText: (isCustomEnabled && content?.hero_badge) ? content.hero_badge : "IZ PATISSERIE & CAFE, Dhaka",
    title1: (isCustomEnabled && content?.hero_title_line_1) ? content.hero_title_line_1 : "Your Cozy Pastry",
    title2: (isCustomEnabled && content?.hero_title_line_2) ? content.hero_title_line_2 : "& Coffee Escape",
    ctaText: (isCustomEnabled && content?.hero_cta_text) ? content.hero_cta_text : "View Menu",
    ctaLink: (isCustomEnabled && content?.hero_cta_link) ? content.hero_cta_link : "/menu"
  };

  console.log('HERO DATA', hero);

  const youtubeEmbedUrl = getYoutubeEmbedUrl(hero.videoUrl);

  // Generate video URL with cache-buster timestamp if available
  let videoSrc = hero.videoUrl;
  if (videoSrc && !youtubeEmbedUrl && content?.updated_at) {
    const cleanBuster = encodeURIComponent(content.updated_at);
    videoSrc = videoSrc.includes('?') ? `${videoSrc}&v=${cleanBuster}` : `${videoSrc}?v=${cleanBuster}`;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0 bg-charcoal overflow-hidden">
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[177.77vw] min-w-[56.25vh] min-h-[100vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-[1.15]"
            title="Background video"
          />
        ) : videoSrc ? (
          <video
            key={videoSrc}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={hero.posterUrl || undefined}
          >
            <source
              src={videoSrc}
              type="video/mp4"
            />
          </video>
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {izGrabLink?.enabled && (
            <motion.a
              href={izGrabLink.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md text-gold text-[10px] md:text-xs font-semibold tracking-widest uppercase hover:bg-gold hover:text-black transition-all duration-300 hover:scale-105"
            >
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Now Available on IZ Grab
            </motion.a>
          )}

          <motion.p
            variants={itemVariants}
            className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-6"
          >
            {hero.badgeText || "IZ PATISSERIE & CAFE, Dhaka"}
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.1] mb-8 text-balance"
          >
            {hero.title1 || "Your Cozy Pastry"} <br className="hidden md:block" />
            <span className="italic font-light">{hero.title2 || "& Coffee Escape"}</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link
              to={hero.ctaLink || "/menu"}
              className="px-8 py-4 bg-cream text-charcoal text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-beige transition-colors duration-300 w-full sm:w-auto text-center"
            >
              {hero.ctaText || "View Menu"}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-cream/60 text-xs uppercase tracking-widest mb-2">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-cream/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
