import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '../settingsTypes';
import type { ShopSettings } from '../settingsTypes';

interface SettingsContextType {
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => Promise<void>;
  saveSettings: () => Promise<void>;
  isSaving: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Function to apply theme to document
  const applyTheme = (appearance: ShopSettings['appearance']) => {
    const root = document.documentElement;
    
    // Apply theme class
    root.className = root.className.replace(/theme-\w+/g, '');
    
    if (appearance.theme === 'dark') {
      root.classList.add('theme-dark');
    } else if (appearance.theme === 'light') {
      root.classList.add('theme-light');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    }
    
    // Apply primary color as CSS custom property
    root.style.setProperty('--primary-color', appearance.primaryColor);
    
    // Convert hex to RGB for use in rgba()
    const hex = appearance.primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
  };

  // Load settings on initial render
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem('barberShopSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          // Apply theme immediately after loading
          applyTheme(parsedSettings.appearance);
        } else {
          // Apply default theme
          applyTheme(DEFAULT_SETTINGS.appearance);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
        // Apply default theme on error
        applyTheme(DEFAULT_SETTINGS.appearance);
      }
    };
    loadSettings();
  }, []);

  // Apply theme whenever settings change
  useEffect(() => {
    applyTheme(settings.appearance);
  }, [settings.appearance]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (settings.appearance.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme(settings.appearance);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.appearance.theme]);

  const updateSettings = async (newSettings: Partial<ShopSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    setDirty(true);
  };

  const saveSettings = async () => {
    if (!dirty) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('barberShopSettings', JSON.stringify(settings));
      setDirty(false);
    } catch (error) {
      console.error('Failed to save settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings, isSaving }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};