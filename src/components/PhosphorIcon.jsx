import {
  AirplaneTilt,
  GameController,
  CastleTurret,
  PaintBrushHousehold,
  Flower,
  House,
  Cat,
  ShoppingBag,
  Mountains,
  Guitar,
  Sailboat,
  Fish,
  TreePalm,
  Waves,
  Heart,
  Tree,
  Coffee,
  Bed,
  Lightning,
  PersonSimpleWalk,
  IceCream,
  ForkKnife,
  Books,
  Balloon,
  TShirt,
  SunHorizon,
  SwimmingPool,
  Suitcase,
  Car,
  Train,
  Subway,
  Bus,
  Taxi,
  Leaf,
  Plant,
  Compass,
  MapTrifold,
  CalendarDots,
  Path,
  CookingPot,
  Storefront,
  Palette,
  Church,
  Package,
  Buildings,
  FlowerLotus,
  Goggles,
  Spiral,
  Globe,
  Sparkle,
  Lighthouse,
  Cookie,
} from '@phosphor-icons/react';

// Emoji → Phosphor icon mapping
const ICON_MAP = {
  // Day emojis
  '✈️': AirplaneTilt,
  '🎮': GameController,
  '🍭': Cookie,
  '🏰': CastleTurret,
  '⛩️': Church,
  '🎨': Palette,
  '🧘': FlowerLotus,
  '🏡': House,
  '🐱': Cat,
  '🗿': Lighthouse,
  '🛍️': ShoppingBag,
  '🗻': Mountains,
  '🎸': Guitar,
  '🏖️': SunHorizon,
  '🚢': Sailboat,
  '🐋': Fish,
  '🏝️': TreePalm,
  '🌊': Waves,
  '🏯': CastleTurret,
  '❤️': Heart,
  '🌳': Tree,
  '☕': Coffee,

  // Activity icons
  '🌸': Flower,
  '🍜': CookingPot,
  '🏛️': Buildings,
  '😴': Bed,
  '🍄': Sparkle,
  '⚡': Lightning,
  '🍱': Package,
  '🚶': PersonSimpleWalk,
  '🍦': IceCream,
  '🏙️': Buildings,
  '🍽️': ForkKnife,
  '🌿': Leaf,
  '📚': Books,
  '🎈': Balloon,
  '🧳': Suitcase,
  '🏺': Storefront,
  '🎋': Plant,
  '👕': TShirt,
  '🚗': Car,
  '🛣️': Path,
  '🤿': Goggles,
  '🌅': SunHorizon,
  '🐚': Spiral,
  '🏊': SwimmingPool,
  '🏠': House,
  '🍙': CookingPot,
  '🚡': Mountains,
  '🚃': Train,

  // Transport
  '🚇': Subway,
  '🚌': Bus,
  '🚕': Taxi,
  '🚝': Train,

  // Section/nav icons
  '📋': MapTrifold,
  '📝': Books,
  '🗾': Globe,
  '📅': CalendarDots,
  '🧭': Compass,

  // Explore
  '🧒': Balloon,
};

// Phase-specific colors
const PHASE_COLORS = {
  'sakura': '#E8879B',
  'ocean': '#0077B6',
  'fuji': '#9C89B8',
  'bamboo': '#7CB342',
  'ink': '#2D2D2D',
  'warm-gray': '#9E9E9E',
  'white': '#FFFFFF',
};

export default function PhosphorIcon({ emoji, size = 24, color, className = '', weight = 'duotone' }) {
  const IconComponent = ICON_MAP[emoji];

  if (!IconComponent) {
    // Fallback to emoji
    return <span className={className} style={{ fontSize: size * 0.8 }}>{emoji}</span>;
  }

  const iconColor = color ? (PHASE_COLORS[color] || color) : PHASE_COLORS['ink'];

  return (
    <IconComponent
      size={size}
      weight={weight}
      color={iconColor}
      className={className}
    />
  );
}

// For transport icons specifically
export function TransportPhosphorIcon({ method, size = 20, color }) {
  const METHOD_MAP = {
    'Tåg': Train,
    'Tunnelbana': Subway,
    'Buss': Bus,
    'Promenad': PersonSimpleWalk,
    'Bil': Car,
    'Buss/Taxi': Taxi,
    'Yurikamome': Train,
    'Disney Resort Line': Train,
    'Enoden': Train,
    'Buss/Promenad': PersonSimpleWalk,
    'Tåg/Buss': Train,
  };

  const IconComponent = METHOD_MAP[method] || Train;
  return <IconComponent size={size} weight="duotone" color={color || '#0077B6'} />;
}
