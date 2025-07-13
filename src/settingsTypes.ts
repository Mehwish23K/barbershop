export interface ShopSettings {
  shopName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  notifications: {
    emailReminders: boolean;
    smsReminders: boolean;
    appointmentConfirmation: boolean;
    marketingEmails: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
  };
}

export const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'Classic Barber Shop',
  address: '123 Main Street, City, State 12345',
  phone: '(555) 123-4567',
  email: 'contact@barber.com',
  website: 'www.classicbarbershop.com',
  openingHours: {
    monday: '9:00 AM - 7:00 PM',
    tuesday: '9:00 AM - 7:00 PM',
    wednesday: '9:00 AM - 7:00 PM',
    thursday: '9:00 AM - 7:00 PM',
    friday: '9:00 AM - 8:00 PM',
    saturday: '10:00 AM - 6:00 PM',
    sunday: 'Closed',
  },
  socialMedia: {
    facebook: 'facebook.com/classicbarbershop',
    instagram: 'instagram.com/classicbarbershop',
    twitter: 'twitter.com/classicbarber',
  },
  notifications: {
    emailReminders: true,
    smsReminders: true,
    appointmentConfirmation: true,
    marketingEmails: false,
  },
  appearance: {
    theme: 'light',
    primaryColor: '#f97316',
  },
};