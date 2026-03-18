import { useState } from 'react';
import PhosphorIcon from './PhosphorIcon';
import { MapPin, Clock, Train, ArrowLeft, CheckCircle, CaretRight, NavigationArrow } from '@phosphor-icons/react';

function mapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + ' Japan')}`;
}

export default function Explore({ data }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [filter, setFilter] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const category = data[activeCategory];
  const filteredPlaces = filter === 'kids'
    ? category.places.filter(p => p.kidFriendly)
    : category.places;

  if (selectedPlace) {
    return <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />;
  }

  // Featured place (first with image in current category)
  const featured = filteredPlaces[0];
  const rest = filteredPlaces.slice(1);

  return (
    <div className="pb-6">
      {/* Category tabs */}
      <div className="px-4 pt-6">
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
          {data.map((cat, i) => (
            <button
              key={cat.category}
              onClick={() => { setActiveCategory(i); setFilter('all'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeCategory === i
                  ? 'bg-sakura text-white'
                  : 'bg-white text-warm-gray border border-gray-200 hover:border-sakura/30'
              }`}
            >
              <PhosphorIcon emoji={cat.icon} size={14} color={activeCategory === i ? 'white' : 'warm-gray'} />
              {cat.category}
            </button>
          ))}
        </div>

        {/* Kid filter */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filter === 'all' ? 'bg-bamboo text-white' : 'bg-gray-100 text-warm-gray'
            }`}
          >
            Alla
          </button>
          <button
            onClick={() => setFilter('kids')}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filter === 'kids' ? 'bg-bamboo text-white' : 'bg-gray-100 text-warm-gray'
            }`}
          >
            Barnvänligt
          </button>
        </div>
      </div>

      {/* Featured card (large) */}
      {featured && (
        <div className="px-4 mb-4">
          <button
            onClick={() => setSelectedPlace(featured)}
            className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
          >
            {featured.image && (
              <div className="relative h-44 overflow-hidden">
                <img src={featured.image} alt="" className="w-full h-full object-cover" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-bold text-white text-base drop-shadow-md">{featured.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} weight="fill" color="white" />
                      <span className="text-white/80 text-xs">{featured.area}</span>
                    </div>
                    {featured.timeNeeded && (
                      <div className="flex items-center gap-1">
                        <Clock size={11} weight="fill" color="white" />
                        <span className="text-white/80 text-xs">{featured.timeNeeded}</span>
                      </div>
                    )}
                  </div>
                </div>
                {featured.kidFriendly && (
                  <span className="absolute top-3 right-3 text-[10px] bg-bamboo-light text-bamboo px-1.5 py-0.5 rounded-full font-medium">
                    Barnvänligt
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <p className="text-sm text-warm-gray line-clamp-2">{featured.description}</p>
              <div className="flex items-center gap-1 mt-2 text-sakura">
                <span className="text-xs font-medium">Läs mer</span>
                <CaretRight size={12} weight="bold" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Rest of places */}
      <div className="px-4 space-y-3">
        {rest.map(place => (
          <button
            key={place.name}
            onClick={() => setSelectedPlace(place)}
            className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
          >
            <div className="flex">
              <div className="w-28 self-stretch shrink-0">
                {place.image ? (
                  <img src={place.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <PhosphorIcon emoji={category.icon} size={28} color="ocean" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink text-sm">{place.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} weight="duotone" color="#FFB7C5" />
                      <span className="text-xs text-sakura">{place.area}</span>
                    </div>
                  </div>
                  {place.kidFriendly && (
                    <span className="text-[10px] bg-bamboo-light text-bamboo px-1.5 py-0.5 rounded-full shrink-0 font-medium">
                      Barnvänligt
                    </span>
                  )}
                </div>
                <p className="text-xs text-warm-gray mt-1.5 line-clamp-2">{place.description}</p>
                {place.timeNeeded && (
                  <div className="flex items-center gap-1 mt-2">
                    <Clock size={11} weight="duotone" color="#9E9E9E" />
                    <span className="text-[10px] text-warm-gray">{place.timeNeeded}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center pr-3">
                <CaretRight size={16} weight="bold" color="#D1D5DB" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlaceDetail({ place, onClose }) {
  return (
    <div className="pb-6">
      {/* Hero image with back button */}
      {place.image ? (
        <div className="relative h-56 overflow-hidden">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Back button circle */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ArrowLeft size={18} weight="bold" color="white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white drop-shadow-md">{place.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <MapPin size={12} weight="fill" color="white" />
                <span className="text-white/80 text-xs">{place.area}</span>
              </div>
              {place.timeNeeded && (
                <div className="flex items-center gap-1">
                  <Clock size={12} weight="fill" color="white" />
                  <span className="text-white/80 text-xs">{place.timeNeeded}</span>
                </div>
              )}
            </div>
          </div>
          {place.kidFriendly && (
            <span className="absolute top-4 right-4 text-xs bg-bamboo-light text-bamboo px-2 py-0.5 rounded-full font-medium">
              Barnvänligt
            </span>
          )}
        </div>
      ) : (
        <div className="px-4 pt-4">
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors mb-4"
          >
            <ArrowLeft size={18} weight="bold" color="#2D2D2D" />
          </button>
        </div>
      )}

      <div className="px-4">
        {/* Description card */}
        <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-3 ${place.image ? '-mt-4 relative z-10' : ''}`}>
          {!place.image && (
            <div className="mb-3">
              <h2 className="text-xl font-bold text-ink">{place.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin size={13} weight="duotone" color="#FFB7C5" />
                  <span className="text-xs text-sakura">{place.area}</span>
                </div>
                {place.timeNeeded && (
                  <div className="flex items-center gap-1">
                    <Clock size={13} weight="duotone" color="#9E9E9E" />
                    <span className="text-xs text-warm-gray">{place.timeNeeded}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <p className="text-sm text-ink/80 leading-relaxed">
            {place.longDescription || place.description}
          </p>
          {/* Maps link */}
          <a
            href={mapsUrl(place.name + ' ' + place.area)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs text-sakura font-medium hover:underline"
          >
            <NavigationArrow size={13} weight="duotone" />
            Visa på Google Maps
          </a>
        </div>

        {/* Transport info */}
        {place.nearestStation && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Train size={16} weight="duotone" color="#FFB7C5" />
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">Närmaste station</h4>
            </div>
            <a
              href={mapsUrl(place.nearestStation)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sakura ml-6 hover:underline flex items-center gap-1"
            >
              {place.nearestStation}
              <NavigationArrow size={11} weight="duotone" />
            </a>
          </div>
        )}

        {/* Tips */}
        {place.tips && place.tips.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Tips</h4>
            <div className="space-y-2.5">
              {place.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={16} weight="duotone" color="#7CB342" className="shrink-0 mt-0.5" />
                  <p className="text-sm text-ink/70">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
