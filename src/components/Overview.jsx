import { useMemo, useState, useEffect } from 'react';

export default function Overview({ data, onSelectDay, bookingStatus }) {
  const today = new Date();
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  const heroImages = useMemo(() =>
    data.days.filter(d => d.heroImage).map(d => d.heroImage),
  [data.days]);

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Timeline progress calculation
  const totalMs = endDate - startDate;
  const elapsedMs = today - startDate;
  const progressPercent = totalMs > 0
    ? Math.max(0, Math.min(100, (elapsedMs / totalMs) * 100))
    : 0;
  const tripStarted = today >= startDate;
  const tripEnded = today > endDate;

  // Phase boundaries as percentages
  const phaseBoundaries = useMemo(() => {
    const phases = [
      { name: 'Tokyo', start: new Date('2026-04-10'), end: new Date('2026-04-22') },
      { name: 'Okinawa', start: new Date('2026-04-23'), end: new Date('2026-05-03') },
      { name: 'Tokyo', start: new Date('2026-05-03'), end: new Date('2026-05-06') },
    ];
    return phases.map(p => ({
      name: p.name,
      startPct: ((p.start - startDate) / totalMs) * 100,
      endPct: ((p.end - startDate) / totalMs) * 100,
      dates: p.name === 'Okinawa'
        ? '23 apr–3 maj'
        : p.start.getDate() === 10
          ? '10–22 apr'
          : '3–6 maj',
    }));
  }, []);

  const bookedDays = data.days.filter(d => d.bookable && bookingStatus[d.date]).length;
  const bookableDays = data.days.filter(d => d.bookable).length;
  const upcomingBookable = data.days.filter(d => d.bookable);

  return (
    <div className="space-y-6">
      {/* Hero + Timeline */}
      <div className="relative">
        {/* Hero image */}
        <div className="relative h-64 overflow-hidden">
          {heroImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === heroIndex ? 'opacity-100' : 'opacity-0'
              }`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Trip info overlay */}
          <div className="absolute bottom-20 left-4 right-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">Japan 2026</h2>
            <p className="text-white/80 text-sm mt-0.5">10 apr – 6 maj · {data.days.length} dagar · {bookedDays}/{bookableDays} bokade</p>
          </div>

          {/* Timeline bar overlaid at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            {/* Track */}
            <div className="relative">
              <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                {tripStarted && (
                  <div
                    className="h-full bg-ocean rounded-full transition-all duration-500"
                    style={{ width: `${tripEnded ? 100 : progressPercent}%` }}
                  />
                )}
              </div>

              {/* Phase dots */}
              {phaseBoundaries.map((phase, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-ocean shadow-sm"
                  style={{ left: `${phase.startPct}%`, marginLeft: '-5px' }}
                />
              ))}
              {/* End dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-ocean shadow-sm"
                style={{ left: '100%', marginLeft: '-5px' }}
              />

              {/* Current position indicator */}
              {tripStarted && !tripEnded && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-ocean rounded-full border-2 border-white shadow-md"
                  style={{ left: `${progressPercent}%`, marginLeft: '-7px' }}
                />
              )}
            </div>

            {/* Phase labels */}
            <div className="flex mt-2">
              {phaseBoundaries.map((phase, i) => {
                const width = phase.endPct - phase.startPct;
                return (
                  <div
                    key={i}
                    className="text-center overflow-visible"
                    style={{ width: `${width}%`, marginLeft: i === 0 ? `${phase.startPct}%` : 0 }}
                  >
                    <p className="text-white font-semibold text-xs drop-shadow-md whitespace-nowrap">{phase.name}</p>
                    <p className="text-white/70 text-[10px] drop-shadow-md whitespace-nowrap">{phase.dates}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bookable activities */}
      <div className="px-4">
        <h2 className="text-sm font-semibold text-warm-gray uppercase tracking-wider mb-3">Att boka</h2>
        <div className="space-y-2">
          {upcomingBookable.map(day => {
            const isBooked = bookingStatus[day.date];
            return (
              <button
                key={day.date}
                onClick={() => onSelectDay(day)}
                className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-ocean/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{day.emoji}</span>
                    <div>
                      <p className="font-semibold text-ink text-sm">{day.title}</p>
                      <p className="text-xs text-warm-gray">{day.weekday} {formatDate(day.date)}</p>
                    </div>
                  </div>
                  {isBooked ? (
                    <span className="text-xs bg-booked-bg text-booked px-2 py-1 rounded-full font-medium">
                      Bokad
                    </span>
                  ) : (
                    <span className="text-xs bg-unbooked-bg text-unbooked px-2 py-1 rounded-full font-medium">Boka</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick timeline */}
      <div className="px-4 pb-6">
        <h2 className="text-sm font-semibold text-warm-gray uppercase tracking-wider mb-3">Tidslinje</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="space-y-1">
            {data.days.map((day, i) => {
              const phaseColor = day.phase === 'Tokyo I' ? 'bg-sakura' : day.phase === 'Okinawa' ? 'bg-ocean' : 'bg-fuji';
              return (
                <button
                  key={day.date}
                  onClick={() => onSelectDay(day)}
                  className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-2 h-2 rounded-full ${phaseColor} shrink-0`} />
                  <span className="text-xs text-warm-gray w-10 shrink-0">{day.weekday.slice(0, 3)}</span>
                  <span className="text-xs text-ink truncate">{day.emoji} {day.title}</span>
                  {day.bookable && (
                    bookingStatus[day.date]
                      ? <span className="text-[10px] bg-booked-bg text-booked px-1.5 py-0.5 rounded-full ml-auto shrink-0">Bokad</span>
                      : <span className="text-[10px] bg-unbooked-bg text-unbooked px-1.5 py-0.5 rounded-full ml-auto shrink-0">Boka</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
