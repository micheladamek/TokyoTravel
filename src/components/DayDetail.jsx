import { useState, useRef } from 'react';
import PhosphorIcon, { TransportPhosphorIcon } from './PhosphorIcon';
import { ArrowLeft, MapPin, NavigationArrow } from '@phosphor-icons/react';

function mapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + ' Japan')}`;
}

export default function DayDetail({
  day,
  onClose,
  completedActivities,
  toggleActivity,
  notes,
  updateNote,
  photos,
  addPhoto,
  removePhoto,
  booked,
  toggleBooking,
}) {
  const [activeSection, setActiveSection] = useState('activities');
  const fileInputRef = useRef(null);

  const dayPhotos = photos[day.date] || [];
  const dayNote = notes[day.date] || '';

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addPhoto(day.date, ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const phaseColor = day.phase === 'Tokyo I' ? 'sakura' : day.phase === 'Okinawa' ? 'ocean' : 'fuji';

  const sections = [
    { id: 'activities', label: 'Aktiviteter', emoji: '📋' },
    { id: 'transport', label: 'Resväg', emoji: '🚃' },
    { id: 'dining', label: 'Mat', emoji: '🍜' },
    { id: 'notes', label: 'Anteckningar', emoji: '📝' },
  ];

  return (
    <div className="pb-6">
      {day.heroImage ? (
        <>
          {/* Hero with back button on image */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={day.heroImage}
              alt={day.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Back button circle */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <ArrowLeft size={18} weight="bold" color="white" />
            </button>
            {day.bookable && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleBooking(); }}
                className={`absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  booked
                    ? 'bg-booked-bg text-booked'
                    : 'bg-unbooked-bg text-unbooked'
                }`}
              >
                {booked ? 'Bokad' : 'Boka'}
              </button>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/80 text-xs">{day.label} · {day.weekday} {formatDate(day.date)}</p>
              <h2 className="text-xl font-bold text-white mt-0.5 drop-shadow-md">{day.title}</h2>
            </div>
          </div>

          {/* Content card overlapping hero */}
          <div className="px-4 -mt-4 relative z-10">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
              <p className="text-sm text-warm-gray">{day.mainActivity}</p>
              <p className="text-xs text-warm-gray italic mt-2">{day.vibe}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Back button without hero */}
          <div className="px-4 pt-4">
            <button
              onClick={onClose}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors mb-4"
            >
              <ArrowLeft size={18} weight="bold" color="#2D2D2D" />
            </button>
          </div>

          <div className="px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 p-5">
              <div className="flex items-start gap-3 mb-3">
                <PhosphorIcon emoji={day.emoji} size={40} color={phaseColor} />
                <div>
                  <p className="text-xs text-warm-gray">{day.label} · {day.weekday} {formatDate(day.date)}</p>
                  <h2 className="text-xl font-bold text-ink mt-0.5">{day.title}</h2>
                  {day.bookable && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBooking(); }}
                      className={`mt-2 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        booked
                          ? 'bg-booked-bg text-booked'
                          : 'bg-unbooked-bg text-unbooked'
                      }`}
                    >
                      {booked ? 'Bokad' : 'Boka'}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-warm-gray">{day.mainActivity}</p>
              <p className="text-xs text-warm-gray italic mt-3 border-t border-gray-100 pt-3">{day.vibe}</p>
            </div>
          </div>
        </>
      )}

      {/* Section tabs */}
      <div className="px-4">
        <div className="flex gap-1 mb-4 overflow-x-auto hide-scrollbar">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeSection === s.id
                  ? `bg-${phaseColor} text-white`
                  : 'bg-white text-warm-gray border border-gray-200'
              }`}
            >
              <PhosphorIcon
                emoji={s.emoji}
                size={14}
                color={activeSection === s.id ? 'white' : 'warm-gray'}
              />
              {s.label}
            </button>
          ))}
        </div>

        {/* Activities */}
        {activeSection === 'activities' && (
          <div className="space-y-2">
            {day.activities.map((activity, i) => {
              const key = `${day.date}-${i}`;
              const done = completedActivities[key];
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                    done ? 'border-bamboo/30 bg-bamboo-light/30' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleActivity(day.date, i)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        done
                          ? 'bg-bamboo border-bamboo text-white'
                          : 'border-gray-300 hover:border-ocean'
                      }`}
                    >
                      {done && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <PhosphorIcon emoji={activity.icon} size={18} color={done ? 'warm-gray' : phaseColor} />
                        <span className={`font-medium text-sm ${done ? 'line-through text-warm-gray' : 'text-ink'}`}>
                          {activity.name}
                        </span>
                      </div>
                      {activity.detail && (
                        <p className="text-xs text-warm-gray mt-0.5 ml-7">{activity.detail}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5 ml-7">
                        <p className="text-[10px] text-ocean">{activity.time}</p>
                        <a
                          href={mapsUrl(activity.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-0.5 text-[10px] text-warm-gray hover:text-ocean transition-colors"
                        >
                          <NavigationArrow size={10} weight="duotone" />
                          Karta
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Transport */}
        {activeSection === 'transport' && (
          <div className="space-y-3">
            {day.transport && day.transport.length > 0 ? (
              day.transport.map((t, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TransportPhosphorIcon method={t.method} size={20} />
                    <span className="text-xs font-medium text-ocean">{t.method}</span>
                    {t.duration && (
                      <span className="text-xs text-warm-gray ml-auto">{t.duration}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <a
                      href={mapsUrl(t.from)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink font-medium hover:text-ocean transition-colors underline decoration-dotted underline-offset-2"
                    >
                      {t.from}
                    </a>
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <a
                      href={mapsUrl(t.to)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink font-medium hover:text-ocean transition-colors underline decoration-dotted underline-offset-2"
                    >
                      {t.to}
                    </a>
                  </div>
                  {t.line && <p className="text-xs text-warm-gray mt-1">{t.line}</p>}
                  {t.tip && (
                    <p className="text-xs text-bamboo mt-2 bg-bamboo-light rounded-lg px-2 py-1">
                      Tips: {t.tip}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-warm-gray text-center py-8">Ingen transport planerad – stanna nära boendet</p>
            )}
          </div>
        )}

        {/* Dining */}
        {activeSection === 'dining' && (
          <div className="space-y-3">
            {day.dining && day.dining.length > 0 ? (
              day.dining.map((d, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-ink">{d.name}</h4>
                        <a
                          href={mapsUrl(d.name + ' ' + d.area)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-0.5 text-[10px] text-warm-gray hover:text-ocean transition-colors shrink-0"
                        >
                          <NavigationArrow size={10} weight="duotone" />
                          Karta
                        </a>
                      </div>
                      <p className="text-xs text-ocean mt-0.5">{d.cuisine} · {d.area}</p>
                      {d.note && <p className="text-xs text-warm-gray mt-1">{d.note}</p>}
                    </div>
                    <PhosphorIcon emoji="🍽️" size={24} color="warm-gray" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-warm-gray text-center py-8">Inga specifika tips – utforska spontant!</p>
            )}
          </div>
        )}

        {/* Notes & Photos */}
        {activeSection === 'notes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-ink mb-2">Anteckning</h4>
              <textarea
                value={dayNote}
                onChange={(e) => updateNote(day.date, e.target.value)}
                placeholder="Skriv dina tankar, minnen, tips..."
                className="w-full h-32 text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-ocean transition-colors"
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-ink mb-2">Foton</h4>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {dayPhotos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(day.date, i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-warm-gray hover:border-ocean hover:text-ocean transition-colors"
              >
                + Lägg till foto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
