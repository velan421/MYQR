import type {
  UserProfile,
  PatientRecord,
  PrivacySettings,
  NotificationItem,
} from '../types';

export interface ProfileRow {
  id: string;
  email: string;
  phone: string;
  patient_record: PatientRecord;
  privacy_settings: PrivacySettings;
  notifications: NotificationItem[];
  onboarding_complete: boolean;
}

import { DEFAULT_PRIVACY_SETTINGS, createEmptyPatientRecord } from '../types';

const getAuthToken = () => localStorage.getItem('auth_token');

export const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        return {
          email: data.user.email || '',
          phone: data.user.phone || '',
          patientRecord: { ...createEmptyPatientRecord(userId), ...(data.user.patientRecord || {}) },
          privacySettings: { ...DEFAULT_PRIVACY_SETTINGS, ...(data.user.privacySettings || {}) },
          notifications: Array.isArray(data.user.notifications) ? data.user.notifications : [],
        };
      }
    }
    return null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to fetch profile from backend:', err.message);
    } else {
      console.error('Failed to fetch profile from backend:', err);
    }
    return null;
  }
};

export const upsertProfile = async (
  userId: string,
  email: string,
  profile: UserProfile,
  onboardingComplete?: boolean
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const token = getAuthToken();
    if (!token) return false;

    const payload: Record<string, unknown> = {
      email,
      phone: profile.phone || '',
      patientRecord: profile.patientRecord,
      privacySettings: profile.privacySettings,
      notifications: profile.notifications || [],
    };
    
    const response = await fetch('/api/profiles/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (onboardingComplete !== undefined && onboardingComplete) {
      await fetch('/api/profiles/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    
    return response.ok;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to save profile to backend:', err.message);
    } else {
      console.error('Failed to save profile to backend:', err);
    }
    return false;
  }
};

export const getOnboardingComplete = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await fetch('/api/profiles/onboarding', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return Boolean(data.onboardingComplete);
    }
    return false;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to read onboarding from backend:', err.message);
    } else {
      console.error('Failed to read onboarding from backend:', err);
    }
    return false;
  }
};

export const setOnboardingComplete = async (userId: string): Promise<void> => {
  if (!userId) return;
  
  try {
    const token = getAuthToken();
    if (!token) return;

    await fetch('/api/profiles/onboarding', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to update onboarding in backend:', err.message);
    } else {
      console.error('Failed to update onboarding in backend:', err);
    }
  }
};

