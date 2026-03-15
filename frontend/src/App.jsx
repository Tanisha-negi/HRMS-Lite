import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import AddEmployeePage from './pages/AddEmployeePage';
import AttendancePage from './pages/AttendancePage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow max-w-6xl mx-auto w-full py-10 px-6">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'add' && <AddEmployeePage />}
        {activeTab === 'attendance' && <AttendancePage />}
      </main>

      <Footer />
    </div>
  );
}

export default App;