import { useState } from 'react';
import PhosphorIcon from './PhosphorIcon';

const PHASE_STYLES = {
  'Tokyo I': { bg: 'bg-sakura-light', border: 'border-sakura', dot: 'bg-sakura', label: 'Tokyo I', color: 'sakura' },
  'Okinawa': { bg: 'bg-ocean-light', border: 'border-ocean', dot: 'bg-ocean', label: 'Okinawa', color: 'ocean' },
  'Tokyo II': { bg: 'bg-fuji-light', border: 'border-fuji', dot: 'bg-fuji', label: 'Tokyo II', color: 'fuji' },
};

export default function Schedule({ days, onSelectDay, completedActivities, bookingStatus }) {
  const [filterPhase, setFilterPhase] = useState('all');

  const filteredDays = filterPhase === 'all' ? days : days.filter(d => d.phase === filterPhase);

  return (
    <div className="px-4 py-6">
      {/* Phase filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar">
        <FilterButton active={filterPhase === 'all'} onClick={() => setFilterPhase('all')}>Alla</FilterButton>
        {Object.keys(PHASE_STYLES).map(phase => (
          <FilterButton key={phase} active={filterPhase === phase} onClick={() => setFilterPhase(phase)}>
            {PHASE_STYLES[phase].label}
          </FilterButton>
        ))}
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {filteredDays.map(day => {
          const style = PHASE_STYLES[day.phase];
          const activityCount = day.activities.length;
          const completedCount = day.activities.filter((_, i) =>
            completedActivities[`${day.date}-${i}`]
          ).length;

          return (
            <button
              key={day.date}
              onClick={() => onSelectDay(day)}
              className={`w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden`}
            >
              <div className="flex">
                <div className="w-24 self-stretch shrink-0">
                  {day.heroImage ? (
                    <img src={day.heroImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <PhosphorIcon emoji={day.emoji} size={32} color={style.color} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className="text-xs text-warm-gray">{day.label} · {day.weekday} {formatDate(day.date)}</span>
                    </div>
                    <h3 className="font-semibold text-ink text-sm">{day.title}</h3>
                    <p className="text-xs text-warm-gray mt-0.5 truncate">{day.mainActivity}</p>

                    <div className="flex items-center gap-3 mt-2">
                      {day.bookable && (
                        bookingStatus[day.date]
                          ? <span className="text-[10px] bg-booked-bg text-booked px-2 py-0.5 rounded-full font-medium">Bokad</span>
                          : <span className="text-[10px] bg-unbooked-bg text-unbooked px-2 py-0.5 rounded-full font-medium">Boka</span>
                      )}
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
                  <svg className="w-4 h-4 text-gray-300 mt-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-ocean text-white'
          : 'bg-white text-warm-gray border border-gray-200 hover:border-ocean/30'
      }`}
    >
      {children}
    </button>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
