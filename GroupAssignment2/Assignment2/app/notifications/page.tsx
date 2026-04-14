import { theme } from '@/styles/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

type Notification = {
  id: string
  icon: keyof typeof Ionicons.glyphMap
  iconBg: string
  title: string
  subtitle: string
  badge?: string
  checked?: boolean
}

const todayNotifications: Notification[] = [
  {
    id: '1',
    icon: 'chatbubble-outline',
    iconBg: '#6B7280',
    title: 'Messages',
    subtitle: '8 new messages',
  },
  {
    id: '2',
    icon: 'trending-up-outline',
    iconBg: '#F97316',
    title: 'Score Increased',
    subtitle: 'Score is 80',
    badge: '8+',
  },
  {
    id: '3',
    icon: 'water-outline',
    iconBg: '#3B82F6',
    title: 'Drink More Water',
    subtitle: 'You need to drink 300ml left',
  },
  {
    id: '4',
    icon: 'barbell-outline',
    iconBg: '#22C55E',
    title: 'Workout Complete',
    subtitle: 'Upper Body Set Completed',
    checked: true,
  },
  {
    id: '5',
    icon: 'nutrition-outline',
    iconBg: '#A855F7',
    title: 'Nutrition Upgrade',
    subtitle: 'Take 47g of protein',
  },
  {
    id: '6',
    icon: 'fitness-outline',
    iconBg: '#EF4444',
    title: 'Fitness Data Ready!',
    subtitle: "Here's Fitness data for tomorrow",
  },
]

const pastNotifications: Notification[] = [
  {
    id: '7',
    icon: 'barbell-outline',
    iconBg: '#22C55E',
    title: 'Yesterday Workout',
    subtitle: 'Full Body Set Completed',
    checked: true,
  },
  {
    id: '8',
    icon: 'water-outline',
    iconBg: '#3B82F6',
    title: 'Hydration Goal Met',
    subtitle: 'You hit your 2L water goal',
  },
]

export default function NotificationsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'today' | 'past'>('today')
  const notifications = activeTab === 'today' ? todayNotifications : pastNotifications

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.white} />
        </Pressable>
        <Text style={styles.heading}>Notifications</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'today' && styles.tabActive]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
              Today
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
              Past
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          {activeTab === 'today' ? 'Earlier Today' : 'Previous'}
        </Text>

        {notifications.map((notif, index) => (
          <View
            key={notif.id}
            style={[
              styles.notifCard,
              index < notifications.length - 1 && styles.notifCardBorder,
            ]}
          >
            {/* Icon */}
            <View style={[styles.iconWrap, { backgroundColor: notif.iconBg }]}>
              <Ionicons name={notif.icon} size={18} color="#fff" />
            </View>

            {/* Text */}
            <View style={styles.notifText}>
              <Text style={styles.notifTitle}>{notif.title}</Text>
              <Text style={styles.notifSub} numberOfLines={2}>{notif.subtitle}</Text>
            </View>

            {/* Badge or check */}
            {notif.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notif.badge}</Text>
              </View>
            )}
            {notif.checked && (
              <View style={styles.checkWrap}>
                <Ionicons name="checkmark" size={14} color={theme.colors.white} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.screen,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.white,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    padding: 3,
    alignSelf: 'center',
    width: 200,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 18,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.white,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  content: {
    padding: theme.spacing.screen,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.subtext,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  notifCardBorder: {
    // individual cards already have margin, keeping them separate
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifText: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  notifSub: {
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 16,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
})