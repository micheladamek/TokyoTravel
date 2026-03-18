import { useState } from 'react';
import PhosphorIcon from './PhosphorIcon';
import { Plus, X, CalendarCheck, Ticket } from '@phosphor-icons/react';

export default function Bookings({ days, onSelectDay, bookingStatus, toggleBooking, customBookings, addCustomBooking, removeCustomBooking, toggleCustomBooking }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newNote, setNewNote] = useState('');

  const bookableDays = days.filter(d => d.bookable);
  const allBookings = [
    ...bookableDays.map(d => ({ type: 'trip', day: d, isBooked: bookingStatus[d.date] })),
    ...(customBookings || []).map((b, i) => ({ type: 'custom', booking: b, index: i })),
  ];

  const bookedCount = bookableDays.filter(d => bookingStatus[d.date]).length
    + (customBookings || []).filter(b => b.booked).length;
  const totalCount = bookableDays.length + (customBookings || []).length;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addCustomBooking({
      title: newTitle.trim(),
      date: newDate || null,
      note: newNote.trim() || null,
      booked: false,
    });
    setNewTitle('');
    setNewDate('');
    setNewNote('');
    setShowAddForm(false);
  };

  return (
    <div className="px-4 py-6">
      {/* Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Bokningsstatus</p>
            <p className="text-xs text-warm-gray mt-0.5">{bookedCount} av {totalCount} bokade</p>
          </div>
          <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
            {bookableDays.map(day => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-full ${bookingStatus[day.date] ? 'bg-booked' : 'bg-unbooked'}`}
              />
            ))}
            {(customBookings || []).map((b, i) => (
              <div
                key={`custom-${i}`}
                className={`w-3 h-3 rounded-full ${b.booked ? 'bg-booked' : 'bg-unbooked'}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-booked rounded-full transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (bookedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Trip bookable items */}
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

        {/* Custom bookings */}
        {(customBookings || []).map((booking, i) => (
          <div
            key={`custom-${i}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="flex">
              <div className="w-24 self-stretch shrink-0 flex items-center justify-center bg-gray-50">
                <Ticket size={28} weight="duotone" color="#0077B6" />
              </div>
              <div className="flex-1 min-w-0 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {booking.date && (
                      <p className="text-xs text-warm-gray">{formatDate(booking.date)}</p>
                    )}
                    <h3 className="font-semibold text-ink text-sm mt-0.5">{booking.title}</h3>
                    {booking.note && (
                      <p className="text-xs text-warm-gray mt-0.5 truncate">{booking.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeCustomBooking(i)}
                    className="shrink-0 w-6 h-6 flex items-center justify-center text-warm-gray hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => toggleCustomBooking(i)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      booking.booked
                        ? 'bg-booked-bg text-booked'
                        : 'bg-unbooked-bg text-unbooked'
                    }`}
                  >
                    {booking.booked ? 'Bokad' : 'Boka'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new booking */}
      {showAddForm ? (
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-ocean/20">
          <h4 className="text-sm font-semibold text-ink mb-3">Ny bokning</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Vad ska bokas? t.ex. 'Restaurant Afuri'"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ocean transition-colors"
              autoFocus
            />
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ocean transition-colors text-warm-gray"
              min="2026-04-10"
              max="2026-05-06"
            />
            <input
              type="text"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Anteckning (valfritt)"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ocean transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="flex-1 py-2 bg-ocean text-white text-sm font-medium rounded-lg disabled:opacity-40 transition-opacity"
              >
                Lägg till
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewTitle(''); setNewDate(''); setNewNote(''); }}
                className="px-4 py-2 text-sm text-warm-gray border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-warm-gray hover:border-ocean hover:text-ocean transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} weight="bold" />
          Lägg till bokning
        </button>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
