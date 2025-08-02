import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CustomUserPage from './pages/CustomUserPage';
import PetPage from './pages/PetPage';
import NGOAccountPage from './pages/NGOAccountPage';
import PetToAdoptPage from './pages/PetToAdoptPage';
import MealPage from './pages/MealPage';
import WalkPage from './pages/WalkPage';
import GroomingPage from './pages/GroomingPage';
import DewormingPage from './pages/DewormingPage';
import ExpensePage from './pages/ExpensePage';
import MedicationPage from './pages/MedicationPage';
import VaccinationPage from './pages/VaccinationPage';
import DocumentPage from './pages/DocumentPage';
import MediaFilePage from './pages/MediaFilePage';
import Login from './pages/Login';
import PetBreedPage from './pages/PetBreedPage';
import PetPersonalityTagPage from './pages/PetPersonalityTagPage';
import EventFieldsPage from './pages/EventFieldsPage';
import MedicationFrequencyPage from './pages/MedicationFrequencyPage';
import TimeZonePage from './pages/TimeZonePage';
import ReminderOptionPage from './pages/ReminderOptionPage';
import DewormingFrequencyPage from './pages/DewormingFrequencyPage';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/custom-user" element={<CustomUserPage />} />
              <Route path="/pet" element={<PetPage />} />
              <Route path="/ngo-account" element={<NGOAccountPage />} />
              <Route path="/pet-to-adopt" element={<PetToAdoptPage />} />
              <Route path="/meal" element={<MealPage />} />
              <Route path="/walk" element={<WalkPage />} />
              <Route path="/grooming" element={<GroomingPage />} />
              <Route path="/deworming" element={<DewormingPage />} />
              <Route path="/expense" element={<ExpensePage />} />
              <Route path="/medication" element={<MedicationPage />} />
              <Route path="/vaccination" element={<VaccinationPage />} />
              <Route path="/document" element={<DocumentPage />} />
              <Route path="/media-file" element={<MediaFilePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pet-breeds" element={<PetBreedPage />} />
              <Route path="/personality-tags" element={<PetPersonalityTagPage />} />
              <Route path="/event-fields" element={<EventFieldsPage />} />
              <Route path="/medication-frequency" element={<MedicationFrequencyPage />} />
              <Route path="/timezone" element={<TimeZonePage />} />
              <Route path="/reminder-options" element={<ReminderOptionPage />} />
              <Route path="/deworming-frequencies" element={<DewormingFrequencyPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;