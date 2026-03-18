import { useState } from 'react';

export default function Explore({ data }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [filter, setFilter] = useState('all');

  const category = data[activeCategory];
  const filteredPlaces = filter === 'kids'
    ? category.places.filter(p => p.kidFriendly)
    : category.places;

  return (
    <div className="px-4 py-6">
      <h2 className="text-sm font-semibold text-warm-gray uppercase tracking-wider mb-3">Platser att utforska</h2>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
        {data.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeCategory === i
                ? 'bg-ocean text-white'
                : 'bg-white text-warm-gray border border-gray-200 hover:border-ocean/30'
            }`}
          >
            <span>{cat.icon}</span> {cat.category}
          </button>
        ))}
      </div>

      {/* Kid filter */}
      <div className="flex gap-2 mb-4">
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

      {/* Places */}
      <div className="space-y-3">
        {filteredPlaces.map(place => (
          <div
            key={place.name}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-ink text-sm">{place.name}</h3>
                <p className="text-xs text-ocean mt-0.5">{place.area}</p>
                <p className="text-xs text-warm-gray mt-1">{place.description}</p>
              </div>
              {place.kidFriendly && (
                <span className="text-xs bg-bamboo-light text-bamboo px-2 py-0.5 rounded-full shrink-0">
                  Barnvänligt
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
