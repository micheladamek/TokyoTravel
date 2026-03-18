import { useState, useRef } from 'react';

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
    { id: 'activities', label: 'Aktiviteter', icon: '📋' },
    { id: 'transport', label: 'Resväg', icon: '🚃' },
    { id: 'dining', label: 'Mat', icon: '🍜' },
    { id: 'notes', label: 'Anteckningar', icon: '📝' },
  ];

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-sm text-ocean mb-4 hover:underline"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tillbaka
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        {day.heroImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={day.heroImage}
              alt={day.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-white/80 text-xs">{day.label} · {day.weekday} {formatDate(day.date)}</p>
              <h2 className="text-xl font-bold text-white mt-0.5 drop-shadow-md">{day.title}</h2>
            </div>
            {day.bookable && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleBooking(); }}
                className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  booked
                    ? 'bg-booked-bg text-booked'
                    : 'bg-unbooked-bg text-unbooked'
                }`}
              >
                {booked ? 'Bokad' : 'Boka'}
              </button>
            )}
          </div>
        )}
        <div className="p-5">
          {!day.heroImage && (
            <div className="flex items-start gap-3 mb-3">
              <span className="text-4xl">{day.emoji}</span>
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
          )}
          <p className="text-sm text-warm-gray">{day.mainActivity}</p>
          <p className={`text-xs text-warm-gray italic ${day.heroImage ? 'mt-2' : 'mt-3 border-t border-gray-100 pt-3'}`}>
            {day.vibe}
          </p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto hide-scrollbar">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeSection === s.id
                ? `bg-${phaseColor} text-white`
                : 'bg-white text-warm-gray border border-gray-200'
            }`}
          >
            {s.icon} {s.label}
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
                      <span>{activity.icon}</span>
                      <span className={`font-medium text-sm ${done ? 'line-through text-warm-gray' : 'text-ink'}`}>
                        {activity.name}
                      </span>
                    </div>
                    {activity.detail && (
                      <p className="text-xs text-warm-gray mt-0.5 ml-7">{activity.detail}</p>
                    )}
                    <p className="text-[10px] text-ocean mt-0.5 ml-7">{activity.time}</p>
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
                  <TransportIcon method={t.method} />
                  <span className="text-xs font-medium text-ocean">{t.method}</span>
                  {t.duration && (
                    <span className="text-xs text-warm-gray ml-auto">{t.duration}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-ink font-medium">{t.from}</span>
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-ink font-medium">{t.to}</span>
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
                  <div>
                    <h4 className="font-semibold text-sm text-ink">{d.name}</h4>
                    <p className="text-xs text-ocean mt-0.5">{d.cuisine} · {d.area}</p>
                    {d.note && <p className="text-xs text-warm-gray mt-1">{d.note}</p>}
                  </div>
                  <span className="text-xl">🍽️</span>
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
  );
}

function TransportIcon({ method }) {
  const icons = {
    'Tåg': '🚃',
    'Tunnelbana': '🚇',
    'Buss': '🚌',
    'Promenad': '🚶',
    'Bil': '🚗',
    'Buss/Taxi': '🚕',
    'Yurikamome': '🚝',
    'Disney Resort Line': '🚝',
    'Enoden': '🚃',
    'Buss/Promenad': '🚶',
    'Tåg/Buss': '🚃',
  };
  return <span className="text-lg">{icons[method] || '🚃'}</span>;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
