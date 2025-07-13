import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Button } from './common';

const ThemeTest: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="p-8 space-y-6">
      <div className="bg-primary border border-primary rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Theme Test Component</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-primary">Background Colors</h3>
              <p className="text-secondary">This card uses bg-secondary</p>
            </div>
            
            <div className="bg-tertiary p-4 rounded-lg">
              <h3 className="font-semibold text-primary">Tertiary Background</h3>
              <p className="text-secondary">This card uses bg-tertiary</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-primary">Primary text color - main content</p>
            <p className="text-secondary">Secondary text color - descriptions</p>
            <p className="text-tertiary">Tertiary text color - subtle info</p>
          </div>

          <div className="flex space-x-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>

          <div className="border border-primary rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Current Settings:</h4>
            <ul className="text-secondary space-y-1">
              <li>Theme: <span className="font-mono">{settings.appearance.theme}</span></li>
              <li>Primary Color: <span className="font-mono">{settings.appearance.primaryColor}</span></li>
              <li>Shop Name: <span className="font-mono">{settings.shopName}</span></li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary-50 p-3 rounded text-center">
              <div className="text-sm font-mono">bg-primary-50</div>
            </div>
            <div className="bg-primary-100 p-3 rounded text-center">
              <div className="text-sm font-mono">bg-primary-100</div>
            </div>
            <div className="bg-primary-200 p-3 rounded text-center">
              <div className="text-sm font-mono">bg-primary-200</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;