import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import Settings from './pages/Settings';
import ThemeTest from './components/ThemeTest';

function AdminApp() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-primary">
          <Routes>
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/theme-test" element={<ThemeTest />} />
            <Route path="/admin" element={<Navigate to="/admin/settings" replace />} />
            <Route path="*" element={<Navigate to="/admin/settings" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default AdminApp;