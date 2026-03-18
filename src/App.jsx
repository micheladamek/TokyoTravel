import { useState, useEffect } from 'react';
import { tripData } from './data/tripData';
import Overview from './components/Overview';
import Schedule from './components/Schedule';
import DayDetail from './components/DayDetail';
import Explore from './components/Explore';
import Navigation from './components/Navigation';
import './index.css';

const TABS = [
  { id: 'overview', label: 'Översikt', icon: '🗾' },
  { id: 'schedule', label: 'Schema', icon: '📅' },
  { id: 'explore', label: 'Utforska', icon: '🧭' },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDay, setSelectedDay] = useState(null);
  const [completedActivities, setCompletedActivities] = useState(() => {
    const saved = localStorage.getItem('tokyotravel-completed');
    return saved ? JSON.parse(saved) : {};
  });
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('tokyotravel-notes');
    return saved ? JSON.parse(saved) : {};
  });
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('tokyotravel-photos');
    return saved ? JSON.parse(saved) : {};
  });
  const [bookingStatus, setBookingStatus] = useState(() => {
    const saved = localStorage.getItem('tokyotravel-bookings');
    if (saved) return JSON.parse(saved);
    const initial = {};
    tripData.days.forEach(day => {
      if (day.bookable) initial[day.date] = true;
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('tokyotravel-completed', JSON.stringify(completedActivities));
  }, [completedActivities]);

  useEffect(() => {
    localStorage.setItem('tokyotravel-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('tokyotravel-photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('tokyotravel-bookings', JSON.stringify(bookingStatus));
  }, [bookingStatus]);

  const toggleBooking = (dayDate) => {
    setBookingStatus(prev => ({ ...prev, [dayDate]: !prev[dayDate] }));
  };

  const toggleActivity = (dayDate, activityIndex) => {
    const key = `${dayDate}-${activityIndex}`;
    setCompletedActivities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateNote = (dayDate, text) => {
    setNotes(prev => ({ ...prev, [dayDate]: text }));
  };

  const addPhoto = (dayDate, photoDataUrl) => {
    setPhotos(prev => ({
      ...prev,
      [dayDate]: [...(prev[dayDate] || []), photoDataUrl],
    }));
  };

  const removePhoto = (dayDate, index) => {
    setPhotos(prev => ({
      ...prev,
      [dayDate]: (prev[dayDate] || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-paper">
      <main className="max-w-2xl mx-auto pb-24">
        {selectedDay ? (
          <DayDetail
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
            completedActivities={completedActivities}
            toggleActivity={toggleActivity}
            notes={notes}
            updateNote={updateNote}
            photos={photos}
            addPhoto={addPhoto}
            removePhoto={removePhoto}
            booked={bookingStatus[selectedDay.date] || false}
            toggleBooking={() => toggleBooking(selectedDay.date)}
          />
        ) : (
          <>
            {activeTab === 'overview' && <Overview data={tripData} onSelectDay={(day) => setSelectedDay(day)} bookingStatus={bookingStatus} />}
            {activeTab === 'schedule' && (
              <Schedule
                days={tripData.days}
                onSelectDay={(day) => setSelectedDay(day)}
                completedActivities={completedActivities}
                bookingStatus={bookingStatus}
              />
            )}
            {activeTab === 'explore' && <Explore data={tripData.explore} />}
          </>
        )}
      </main>

      {!selectedDay && (
        <Navigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}

export default App;
