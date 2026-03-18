import { useMemo, useState } from 'react';
import { Heart, Images, X } from '@phosphor-icons/react';

export default function PhotoGallery({ days, photos, onSelectDay }) {
  const [viewMode, setViewMode] = useState('timeline');
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);

  // Collect all photos with their day context
  const allPhotos = useMemo(() => {
    const result = [];
    days.forEach(day => {
      const dayPhotos = photos[day.date] || [];
      dayPhotos.forEach((photo, i) => {
        result.push({
          src: photo,
          day,
          index: i,
        });
      });
    });
    return result;
  }, [days, photos]);

  // Group by phase for timeline
  const photosByPhase = useMemo(() => {
    const phases = {};
    days.forEach(day => {
      const dayPhotos = photos[day.date] || [];
      if (dayPhotos.length === 0) return;
      if (!phases[day.phase]) {
        phases[day.phase] = [];
      }
      phases[day.phase].push({
        day,
        photos: dayPhotos,
      });
    });
    return phases;
  }, [days, photos]);

  const totalPhotos = allPhotos.length;

  if (totalPhotos === 0) {
    return (
      <div className="px-4 py-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} weight="duotone" color="#FFB7C5" />
          <h3 className="text-lg font-semibold text-ink mt-4">Inga minnen ännu</h3>
          <p className="text-sm text-warm-gray mt-2 max-w-xs">
            Lägg till foton under varje dags anteckningar för att fylla din resejournal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Fullscreen photo overlay */}
      {fullscreenPhoto !== null && (
        <div
          className="fullscreen-overlay"
          onClick={() => setFullscreenPhoto(null)}
        >
          <button
            onClick={() => setFullscreenPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center z-10"
          >
            <X size={20} weight="bold" color="white" />
          </button>
          <img
            src={fullscreenPhoto}
            alt=""
            className="max-w-full max-h-full object-contain p-4"
          />
        </div>
      )}

      {/* Header with stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-warm-gray">{totalPhotos} minnen</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'timeline' ? 'bg-white text-ink shadow-sm' : 'text-warm-gray'
            }`}
          >
            Tidslinje
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-white text-ink shadow-sm' : 'text-warm-gray'
            }`}
          >
            Galleri
          </button>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        /* Timeline view */
        <div className="space-y-6">
          {Object.entries(photosByPhase).map(([phase, dayEntries]) => (
            <div key={phase}>
              {/* Phase header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-sakura" />
                <h3 className="text-sm font-semibold text-ink">{phase}</h3>
                <span className="text-xs text-warm-gray">
                  {dayEntries.reduce((sum, e) => sum + e.photos.length, 0)} minnen
                </span>
              </div>

              {/* Days in this phase */}
              <div className="space-y-4 ml-1.5 pl-4 border-l-2 border-gray-100">
                {dayEntries.map(({ day, photos: dayPhotos }) => (
                  <div key={day.date}>
                    <button
                      onClick={() => onSelectDay(day)}
                      className="text-left mb-2 hover:underline"
                    >
                      <p className="text-xs font-semibold text-ink">{day.label} – {day.title}</p>
                      <p className="text-[10px] text-warm-gray">{day.weekday} {formatDate(day.date)}</p>
                    </button>
                    <div className="grid grid-cols-3 gap-1.5">
                      {dayPhotos.map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => setFullscreenPhoto(photo)}
                          className="aspect-square rounded-lg overflow-hidden"
                        >
                          <img
                            src={photo}
                            alt={`${day.title} foto ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-3 gap-1.5">
          {allPhotos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setFullscreenPhoto(photo.src)}
              className="aspect-square rounded-lg overflow-hidden relative group"
            >
              <img
                src={photo.src}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 w-full">
                  <p className="text-[9px] text-white font-medium truncate drop-shadow-md">{photo.day.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
