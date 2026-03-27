import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USERS: 'lingualeap_auth_users',
  SESSION: 'lingualeap_auth_session',
};

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  avatarEmoji: string;
  createdAt: string;
  isPremium: boolean;
  premiumExpiresAt: string | null;
}

interface StoredUser extends UserAccount {
  passwordHash: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

async function getUsers(): Promise<StoredUser[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

async function saveUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

const AVATARS = ['🧑‍🎓', '👩‍🎓', '🦊', '🐱', '🦉', '🐼', '🦁', '🐸', '🐨', '🐰'];

export async function signUp(username: string, email: string, password: string): Promise<UserAccount | null> {
  const users = await getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return null;

  const newUser: StoredUser = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    username,
    email: email.toLowerCase(),
    avatarEmoji: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    createdAt: new Date().toISOString(),
    isPremium: false,
    premiumExpiresAt: null,
    passwordHash: simpleHash(password),
  };

  users.push(newUser);
  await saveUsers(users);
  await AsyncStorage.setItem(KEYS.SESSION, newUser.id);

  const { passwordHash: _, ...account } = newUser;
  return account;
}

export async function signIn(email: string, password: string): Promise<UserAccount | null> {
  const users = await getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === simpleHash(password)
  );
  if (!user) return null;

  await AsyncStorage.setItem(KEYS.SESSION, user.id);
  const { passwordHash: _, ...account } = user;
  return account;
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.SESSION);
}

export async function getCurrentUser(): Promise<UserAccount | null> {
  try {
    const sessionId = await AsyncStorage.getItem(KEYS.SESSION);
    if (!sessionId) return null;

    const users = await getUsers();
    const user = users.find(u => u.id === sessionId);
    if (!user) return null;

    const { passwordHash: _, ...account } = user;
    return account;
  } catch { return null; }
}

export async function updateProfile(updates: Partial<Pick<UserAccount, 'username' | 'avatarEmoji' | 'isPremium' | 'premiumExpiresAt'>>): Promise<UserAccount | null> {
  const sessionId = await AsyncStorage.getItem(KEYS.SESSION);
  if (!sessionId) return null;

  const users = await getUsers();
  const index = users.findIndex(u => u.id === sessionId);
  if (index === -1) return null;

  Object.assign(users[index], updates);
  await saveUsers(users);

  const { passwordHash: _, ...account } = users[index];
  return account;
}
