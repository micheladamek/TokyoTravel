import { useState, useEffect } from 'react';
import { tripData } from './data/tripData';
import Overview from './components/Overview';
import DayDetail from './components/DayDetail';
import Explore from './components/Explore';
import PhotoGallery from './components/PhotoGallery';
import Navigation from './components/Navigation';
import './index.css';

const TABS = [
  { id: 'overview', label: 'Översikt', icon: '🗾' },
  { id: 'explore', label: 'Utforska', icon: '🧭' },
  { id: 'memories', label: 'Minnen', icon: '📷' },
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
  const [customActivities, setCustomActivities] = useState(() => {
    const saved = localStorage.getItem('tokyotravel-custom-activities');
    return saved ? JSON.parse(saved) : {};
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
    localStorage.setItem('tokyotravel-custom-activities', JSON.stringify(customActivities));
  }, [customActivities]);

  const addCustomActivity = (dayDate, activity) => {
    setCustomActivities(prev => ({
      ...prev,
      [dayDate]: [...(prev[dayDate] || []), activity],
    }));
  };

  const removeCustomActivity = (dayDate, index) => {
    setCustomActivities(prev => ({
      ...prev,
      [dayDate]: (prev[dayDate] || []).filter((_, i) => i !== index),
    }));
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
            customActivities={customActivities[selectedDay.date] || []}
            addCustomActivity={(activity) => addCustomActivity(selectedDay.date, activity)}
            removeCustomActivity={(index) => removeCustomActivity(selectedDay.date, index)}
          />
        ) : (
          <>
            {activeTab === 'overview' && (
              <Overview
                data={tripData}
                onSelectDay={(day) => setSelectedDay(day)}
                completedActivities={completedActivities}
              />
            )}
            {activeTab === 'explore' && <Explore data={tripData.explore} />}
            {activeTab === 'memories' && (
              <PhotoGallery
                days={tripData.days}
                photos={photos}
                onSelectDay={(day) => setSelectedDay(day)}
              />
            )}
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
