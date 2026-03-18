import PhosphorIcon from './PhosphorIcon';

export default function Bookings({ days, onSelectDay, bookingStatus, toggleBooking }) {
  const bookableDays = days.filter(d => d.bookable);
  const bookedCount = bookableDays.filter(d => bookingStatus[d.date]).length;

  return (
    <div className="px-4 py-6">
      {/* Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Bokningsstatus</p>
            <p className="text-xs text-warm-gray mt-0.5">{bookedCount} av {bookableDays.length} bokade</p>
          </div>
          <div className="flex gap-1">
            {bookableDays.map(day => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-full ${bookingStatus[day.date] ? 'bg-booked' : 'bg-unbooked'}`}
              />
            ))}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-booked rounded-full transition-all duration-500"
            style={{ width: `${bookableDays.length > 0 ? (bookedCount / bookableDays.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Bookable items */}
      <div className="space-y-3">
        {bookableDays.map(day => {
          const isBooked = bookingStatus[day.date];
          const phaseColor = day.phase === 'Tokyo I' ? 'sakura' : day.phase === 'Okinawa' ? 'ocean' : 'fuji';

          return (
            <div
              key={day.date}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="flex">
                <div className="w-24 self-stretch shrink-0">
                  {day.heroImage ? (
                    <img src={day.heroImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <PhosphorIcon emoji={day.emoji} size={28} color={phaseColor} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 p-4">
                  <button
                    onClick={() => onSelectDay(day)}
                    className="text-left w-full"
                  >
                    <p className="text-xs text-warm-gray">{day.label} · {day.weekday} {formatDate(day.date)}</p>
                    <h3 className="font-semibold text-ink text-sm mt-0.5">{day.title}</h3>
                    <p className="text-xs text-warm-gray mt-0.5 truncate">{day.mainActivity}</p>
                  </button>
                  <div className="mt-2">
                    <button
                      onClick={() => toggleBooking(day.date)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        isBooked
                          ? 'bg-booked-bg text-booked'
                          : 'bg-unbooked-bg text-unbooked'
                      }`}
                    >
                      {isBooked ? 'Bokad' : 'Boka'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
