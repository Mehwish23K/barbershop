import React, { useState } from 'react';
import { Modal, Alert, Button, Input, Select, Card } from '../components/common';
import { useSettings } from '../context/SettingsContext';

export default function Settings() {
  const { 
    settings, 
    updateSettings, 
    saveSettings, 
    isSaving 
  } = useSettings();

  const [activeTab, setActiveTab] = useState('general');
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleGeneralInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleOpeningHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSettings({
      openingHours: {
        ...settings.openingHours,
        [name]: value,
      },
    });
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSettings({
      socialMedia: {
        ...settings.socialMedia,
        [name]: value,
      },
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateSettings({
      notifications: {
        ...settings.notifications,
        [name]: checked,
      },
    });
  };

  const handleThemeChange = (value: string) => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        theme: value as 'light' | 'dark' | 'system',
      },
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        primaryColor: e.target.value,
      },
    });
  };

  const confirmSaveSettings = () => {
    setIsConfirmModalOpen(true);
  };

  const handleSaveSettings = async () => {
    setIsConfirmModalOpen(false);
    await saveSettings();
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System Default' }
  ];

  return (
    <div className="space-y-6 p-6 bg-primary min-h-screen">
      {/* Page header */}
      <div className="pb-5 border-b border-primary sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-bold leading-6 text-primary">Settings</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Button
            onClick={confirmSaveSettings}
            disabled={isSaving}
            icon={isSaving ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : undefined}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Settings tabs */}
      <div className="border-b border-primary">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['general', 'hours', 'notifications', 'appearance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab ? 'active' : ''
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card
              title="Shop Information"
              subtitle="Basic information about your barber shop."
            >
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <Input
                    label="Shop Name"
                    name="shopName"
                    id="shopName"
                    value={settings.shopName}
                    onChange={handleGeneralInfoChange}
                  />
                </div>

                <div className="col-span-6">
                  <Input
                    label="Address"
                    name="address"
                    id="address"
                    value={settings.address}
                    onChange={handleGeneralInfoChange}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <Input
                    label="Phone"
                    name="phone"
                    id="phone"
                    value={settings.phone}
                    onChange={handleGeneralInfoChange}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={settings.email}
                    onChange={handleGeneralInfoChange}
                  />
                </div>

                <div className="col-span-6">
                  <Input
                    label="Website"
                    name="website"
                    id="website"
                    value={settings.website}
                    onChange={handleGeneralInfoChange}
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Social Media"
              subtitle="Your barber shop's social media profiles."
            >
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <Input
                    label="Facebook"
                    name="facebook"
                    id="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={handleSocialMediaChange}
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <Input
                    label="Instagram"
                    name="instagram"
                    id="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={handleSocialMediaChange}
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <Input
                    label="Twitter"
                    name="twitter"
                    id="twitter"
                    value={settings.socialMedia.twitter}
                    onChange={handleSocialMediaChange}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Hours Settings */}
        {activeTab === 'hours' && (
          <Card
            title="Opening Hours"
            subtitle="Set your barber shop's operating hours."
          >
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(settings.openingHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-secondary capitalize">
                      {day}
                    </label>
                  </div>
                  <div className="col-span-4">
                    <Input
                      name={day}
                      value={hours}
                      onChange={handleOpeningHoursChange}
                      placeholder="9:00 AM - 5:00 PM"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <Card
            title="Notification Preferences"
            subtitle="Configure how and when notifications are sent."
          >
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="emailReminders"
                    name="emailReminders"
                    type="checkbox"
                    checked={settings.notifications.emailReminders}
                    onChange={handleNotificationChange}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailReminders" className="font-medium text-primary">Email Reminders</label>
                  <p className="text-secondary">Send appointment reminders via email.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="smsReminders"
                    name="smsReminders"
                    type="checkbox"
                    checked={settings.notifications.smsReminders}
                    onChange={handleNotificationChange}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="smsReminders" className="font-medium text-primary">SMS Reminders</label>
                  <p className="text-secondary">Send appointment reminders via SMS.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="appointmentConfirmation"
                    name="appointmentConfirmation"
                    type="checkbox"
                    checked={settings.notifications.appointmentConfirmation}
                    onChange={handleNotificationChange}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="appointmentConfirmation" className="font-medium text-primary">Appointment Confirmation</label>
                  <p className="text-secondary">Send confirmation when an appointment is booked.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingEmails"
                    name="marketingEmails"
                    type="checkbox"
                    checked={settings.notifications.marketingEmails}
                    onChange={handleNotificationChange}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingEmails" className="font-medium text-primary">Marketing Emails</label>
                  <p className="text-secondary">Send promotional emails and special offers.</p>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <Card
            title="Appearance"
            subtitle="Customize the look and feel of your barber shop admin panel."
          >
            <div className="space-y-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <Select
                    label="Theme"
                    id="theme"
                    options={themeOptions}
                    value={settings.appearance.theme}
                    onChange={handleThemeChange}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-secondary">
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={settings.appearance.primaryColor}
                      onChange={handleColorChange}
                      className="h-8 w-8 border border-primary rounded-md shadow-sm"
                    />
                    <span className="ml-2 text-sm text-secondary">{settings.appearance.primaryColor}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary p-4 rounded-md">
                <h4 className="text-sm font-medium text-primary">Preview</h4>
                <div className="mt-3 flex space-x-4">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Save Settings"
        primaryActionLabel="Save"
        onPrimaryAction={handleSaveSettings}
      >
        <p className="text-sm text-secondary">
          Are you sure you want to save these settings? This will update your barber shop configuration.
        </p>
      </Modal>

      {/* Saved Message */}
      {showSavedMessage && (
        <Alert
          type="success"
          message="Settings saved successfully!"
          show={showSavedMessage}
          onClose={() => setShowSavedMessage(false)}
        />
      )}
    </div>
  );
}