import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile, getCurrentUser } from './auth';

const KEYS = {
  ACTIVE_PLAN: 'lingualeap_subscription_plan',
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameRu: string;
  price: number;
  period: string;
  features: string[];
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    nameRu: 'Месячная подписка',
    price: 4.99,
    period: 'в месяц',
    features: ['Бесконечные жизни', 'Без рекламы', 'Эксклюзивные уроки', 'Детальная статистика'],
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    nameRu: 'Годовая подписка',
    price: 29.99,
    period: 'в год',
    features: ['Бесконечные жизни', 'Без рекламы', 'Эксклюзивные уроки', 'Детальная статистика', 'Экономия 50%'],
  },
  {
    id: 'lifetime',
    name: 'Premium Forever',
    nameRu: 'Навсегда',
    price: 79.99,
    period: 'одноразово',
    features: ['Бесконечные жизни', 'Без рекламы', 'Эксклюзивные уроки', 'Детальная статистика', 'Пожизненный доступ'],
  },
];

export async function subscribeToPlan(planId: string): Promise<boolean> {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return false;

  let expiresAt: string | null = null;
  const now = new Date();

  if (planId === 'monthly') {
    now.setMonth(now.getMonth() + 1);
    expiresAt = now.toISOString();
  } else if (planId === 'yearly') {
    now.setFullYear(now.getFullYear() + 1);
    expiresAt = now.toISOString();
  }
  // lifetime = null (never expires)

  await updateProfile({ isPremium: true, premiumExpiresAt: expiresAt });
  await AsyncStorage.setItem(KEYS.ACTIVE_PLAN, planId);
  return true;
}

export async function checkSubscription(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      // Check local-only premium flag
      const planId = await AsyncStorage.getItem(KEYS.ACTIVE_PLAN);
      return !!planId;
    }

    if (!user.isPremium) return false;

    if (user.premiumExpiresAt) {
      const expires = new Date(user.premiumExpiresAt);
      if (expires < new Date()) {
        await updateProfile({ isPremium: false, premiumExpiresAt: null });
        await AsyncStorage.removeItem(KEYS.ACTIVE_PLAN);
        return false;
      }
    }
    return true;
  } catch { return false; }
}

export async function getActivePlan(): Promise<SubscriptionPlan | null> {
  try {
    const planId = await AsyncStorage.getItem(KEYS.ACTIVE_PLAN);
    if (!planId) return null;
    return PLANS.find(p => p.id === planId) || null;
  } catch { return null; }
}

export async function cancelSubscription(): Promise<void> {
  await updateProfile({ isPremium: false, premiumExpiresAt: null });
  await AsyncStorage.removeItem(KEYS.ACTIVE_PLAN);
}
