import { useMemo, useState, useEffect } from 'react';
import PhosphorIcon from './PhosphorIcon';
import { CaretDown, CaretUp, CaretRight } from '@phosphor-icons/react';

export default function Overview({ data, onSelectDay, completedActivities }) {
  const today = new Date();
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  const heroImages = useMemo(() =>
    data.days.filter(d => d.heroImage).map(d => d.heroImage),
  [data.days]);

  const [heroIndex, setHeroIndex] = useState(0);
  const [timelineOpen, setTimelineOpen] = useState(false);

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
        ? '23 apr – 6 maj'
        : p.start.getDate() === 10
          ? '10–22 apr'
          : '3 –6 maj',
    }));
  }, []);

  return (
    <div>
      {/* Hero + Timeline */}
      <div className="relative">
        <div className="relative h-72 overflow-hidden">
          {heroImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === heroIndex ? 'opacity-100 ken-burns' : 'opacity-0'
              }`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Timeline bar overlaid at bottom */}
          <div className="absolute bottom-10 left-0 right-0 px-5">
            <div className="relative">
              <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                {tripStarted && (
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${tripEnded ? 100 : progressPercent}%` }}
                  />
                )}
              </div>
              {phaseBoundaries.map((phase, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-white/50 shadow-sm"
                  style={{ left: `${phase.startPct}%`, marginLeft: '-5px' }}
                />
              ))}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-white/50 shadow-sm"
                style={{ left: '100%', marginLeft: '-5px' }}
              />
              {tripStarted && !tripEnded && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-sakura rounded-full border-2 border-white shadow-md"
                  style={{ left: `${progressPercent}%`, marginLeft: '-7px' }}
                />
              )}
            </div>
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

      {/* Day cards overlapping the hero */}
      <div className="px-4 -mt-6 relative z-10 space-y-3">
        {data.days.map(day => {
          const activityCount = day.activities.length;
          const completedCount = completedActivities
            ? day.activities.filter((_, i) => completedActivities[`${day.date}-${i}`]).length
            : 0;

          return (
            <button
              key={day.date}
              onClick={() => onSelectDay(day)}
              className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex">
                <div className="w-24 self-stretch shrink-0">
                  {day.heroImage ? (
                    <img src={day.heroImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <PhosphorIcon emoji={day.emoji} size={32} color="sakura" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-warm-gray">{day.label} · {day.weekday} {formatDate(day.date)}</span>
                    </div>
                    <h3 className="font-semibold text-ink text-sm">{day.title}</h3>
                    <p className="text-xs text-warm-gray mt-0.5 truncate">{day.mainActivity}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {activityCount > 0 && (
                        <span className="text-[10px] text-warm-gray">
                          {completedCount}/{activityCount} klara
                        </span>
                      )}
                      {completedCount === activityCount && activityCount > 0 && (
                        <span className="text-[10px] text-bamboo font-medium">Klar!</span>
                      )}
                    </div>
                  </div>
                  <CaretRight size={16} weight="bold" color="#D1D5DB" className="mt-2 shrink-0" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Collapsible timeline */}
      <div className="px-4 pt-6 pb-6">
        <button
          onClick={() => setTimelineOpen(!timelineOpen)}
          className="w-full flex items-center justify-between mb-3"
        >
          <h2 className="text-sm font-semibold text-warm-gray uppercase tracking-wider">Tidslinje</h2>
          {timelineOpen
            ? <CaretUp size={16} weight="bold" color="#9E9E9E" />
            : <CaretDown size={16} weight="bold" color="#9E9E9E" />
          }
        </button>
        {timelineOpen && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="space-y-1">
              {data.days.map((day) => {
                return (
                  <button
                    key={day.date}
                    onClick={() => onSelectDay(day)}
                    className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-xs text-warm-gray w-10 shrink-0">{day.weekday.slice(0, 3)}</span>
                    <PhosphorIcon emoji={day.emoji} size={14} color="warm-gray" className="shrink-0" />
                    <span className="text-xs text-ink truncate">{day.title}</span>
                  </button>
                );
              })}
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
