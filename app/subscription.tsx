import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import { getCurrentUser, UserAccount } from '../src/utils/auth';
import {
  PLANS,
  SubscriptionPlan,
  subscribeToPlan,
  checkSubscription,
  getActivePlan,
  cancelSubscription,
} from '../src/utils/subscription';

export default function SubscriptionScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const u = await getCurrentUser();
    setUser(u);
    const premium = await checkSubscription();
    setIsPremium(premium);
    if (premium) {
      const plan = await getActivePlan();
      setActivePlan(plan);
    }
  };

  const handleSubscribe = async (planId: string) => {
    Alert.alert(
      'Оформление подписки',
      'В данный момент оплата недоступна. Подписка будет активирована в демо-режиме.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Активировать демо',
          onPress: async () => {
            await subscribeToPlan(planId);
            await loadData();
            Alert.alert('Готово!', 'Premium подписка активирована');
          },
        },
      ]
    );
  };

  const handleCancel = async () => {
    Alert.alert(
      'Отмена подписки',
      'Вы уверены, что хотите отменить Premium?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отменить',
          style: 'destructive',
          onPress: async () => {
            await cancelSubscription();
            await loadData();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Назад</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.crownEmoji}>👑</Text>
        <Text style={styles.title}>LinguaLeap Premium</Text>
        <Text style={styles.subtitle}>Разблокируйте полный потенциал обучения</Text>
      </View>

      {isPremium ? (
        <View style={styles.activeCard}>
          <Text style={styles.activeIcon}>✅</Text>
          <Text style={styles.activeTitle}>Premium активен</Text>
          {activePlan && (
            <Text style={styles.activePlan}>Тариф: {activePlan.nameRu}</Text>
          )}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Отменить подписку</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Features */}
          <View style={styles.featuresCard}>
            <FeatureRow icon="❤️" title="Бесконечные жизни" description="Учитесь без ограничений" />
            <FeatureRow icon="🚫" title="Без рекламы" description="Чистый интерфейс без отвлечений" />
            <FeatureRow icon="📚" title="Эксклюзивные уроки" description="Доступ к продвинутому контенту" />
            <FeatureRow icon="📊" title="Детальная статистика" description="Глубокий анализ прогресса" />
            <FeatureRow icon="🔄" title="Работа над ошибками" description="Умное повторение слов" />
            <FeatureRow icon="🎯" title="Ежедневные задания" description="Уникальные челленджи каждый день" />
          </View>

          {/* Plans */}
          <View style={styles.plansSection}>
            <Text style={styles.plansTitle}>Выберите тариф</Text>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                {plan.id === 'yearly' && (
                  <View style={styles.bestValueBadge}>
                    <Text style={styles.bestValueText}>ЛУЧШАЯ ЦЕНА</Text>
                  </View>
                )}
                <View style={styles.planInfo}>
                  <View style={[styles.radio, selectedPlan === plan.id && styles.radioSelected]}>
                    {selectedPlan === plan.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.planDetails}>
                    <Text style={styles.planName}>{plan.nameRu}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                  <Text style={styles.planPrice}>${plan.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => handleSubscribe(selectedPlan)}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeText}>Оформить подписку</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Оплата будет доступна в следующих обновлениях. Сейчас подписка активируется в демо-режиме.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

function FeatureRow({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureInfo}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    ...Typography.body,
    color: Colors.primary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  crownEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  activeCard: {
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  activeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  activeTitle: {
    ...Typography.h2,
    color: Colors.success,
    marginBottom: 8,
  },
  activePlan: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelText: {
    ...Typography.caption,
    color: Colors.error,
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: 'rgba(100, 100, 200, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  featureDesc: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  plansSection: {
    marginBottom: 24,
  },
  plansTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(108, 99, 255, 0.06)',
  },
  bestValueBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.xpGold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  bestValueText: {
    ...Typography.small,
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 10,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  planDetails: {
    flex: 1,
  },
  planName: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  planPeriod: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  planPrice: {
    ...Typography.h2,
    color: Colors.primary,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  subscribeText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 18,
  },
  disclaimer: {
    ...Typography.small,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
