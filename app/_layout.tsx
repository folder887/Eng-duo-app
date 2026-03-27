import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../src/constants/colors';

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderTopColor: Colors.glassBorder,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: Colors.glassShadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 16,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          shadowColor: Colors.glassShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 3,
        },
        headerTitleStyle: {
          color: Colors.text,
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Обучение',
          tabBarIcon: () => <TabIcon emoji="📚" />,
          headerTitle: 'LinguaLeap',
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Задание',
          tabBarIcon: () => <TabIcon emoji="🎯" />,
          headerTitle: 'Задание дня',
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Практика',
          tabBarIcon: () => <TabIcon emoji="🔄" />,
          headerTitle: 'Практика',
        }}
      />
      <Tabs.Screen
        name="mistakes"
        options={{
          title: 'Ошибки',
          tabBarIcon: () => <TabIcon emoji="📝" />,
          headerTitle: 'Работа над ошибками',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: () => <TabIcon emoji="👤" />,
          headerTitle: 'Профиль',
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen
        name="lesson/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="auth"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="subscription"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="achievements"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
