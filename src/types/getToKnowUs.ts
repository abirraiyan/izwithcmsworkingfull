export interface GetToKnowUsContent {
  settings: PageSettings;
  founders: FoundersSection;
  philosophy: PhilosophySection;
}

export interface PageSettings {
  background: string;
  enableAnimation: boolean;
  animationIntensity: "low" | "medium" | "high";
}

export interface FoundersSection {
  enabled: boolean;
  backgroundMedia: MediaAsset | null;
  backgroundOverlayOpacity: number;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  quote: string;
  imageLeft: MediaAsset | null;
  imageRight: MediaAsset | null;
  imageLeftShape: "rounded" | "circle" | "organic";
  imageRightShape: "rounded" | "circle" | "organic";
  imageAnimation: "none" | "float" | "parallax" | "fade" | "scale";
}

export interface PhilosophySection {
  enabled: boolean;
  badge: string;
  titleNormal: string;
  titleAccent: string;
  subtitle: string;
  cards: PhilosophyCard[];
}

export interface PhilosophyCard {
  id: string;
  icon: "heart" | "star" | "coffee" | "users" | "sparkles" | "chef";
  title: string;
  description: string;
  accentColor: string;
  hoverEffect: "lift" | "glow" | "scale" | "none";
  enabled: boolean;
  order: number;
}

export interface MediaAsset {
  url: string;
  type: "image" | "video";
  mimeType: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
}
