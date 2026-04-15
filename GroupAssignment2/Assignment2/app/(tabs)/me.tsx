import { supabase } from '@/lib/supabase'
import { theme } from '@/styles/theme'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { BarChart } from 'react-native-chart-kit'

const screenWidth = Dimensions.get('window').width - theme.spacing.screen * 2

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ data: [60, 90, 45, 70, 55, 80, 40] }],
}

// TODO: replace with real notifications query when you wire that up.
// For now this just controls the red badge.
const UNREAD_NOTIFICATIONS = 8

type ProfileView = {
  full_name: string
  location: string
  membership: string
  age: number | null
  weight_kg: number | null
  daily_intake: number | null
  avatar_url: string | null
  cover_url: string | null
}

const fallback: ProfileView = {
  full_name: 'Makise Kurisu',
  location: 'Canada, Calgary',
  membership: 'Basic Member',
  age: 17,
  weight_kg: 68,
  daily_intake: 978,
  avatar_url: null,
  cover_url: null,
}

export default function MeScreen() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileView>(fallback)

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        if (data) {
          setProfile({
            full_name: data.full_name || fallback.full_name,
            location: data.location || fallback.location,
            membership: data.membership || fallback.membership,
            age: data.age,
            weight_kg: data.weight_kg,
            daily_intake: data.daily_intake,
            avatar_url: data.avatar_url,
            cover_url: data.cover_url,
          })
        }
      })()
    }, [])
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Profile</Text>

      {/* Hero cover + avatar */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroCover}>
          <Image
            source={require('@/assets/images/illustration fitness equipments design background.png')}
            style={styles.coverImage}
          />
        </View>
        <View style={styles.avatarRow}>
          <Image
            source={{
              uri: profile.avatar_url || 'https://i.pravatar.cc/100?img=12',
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Name + settings */}
      <View style={styles.nameRow}>
        <View style={{ flex: 1 }} />
        <View style={styles.nameCenter}>
          <Text style={styles.name}>{profile.full_name}</Text>
          <Text style={styles.location}>
            {profile.location}  ·  {profile.membership}
          </Text>
        </View>
        <View style={styles.gearWrap}>
          <Pressable
            style={styles.gearBtn}
            onPress={() => router.push('/account-settings/page')}
          >
            <Ionicons name="settings-outline" size={22} color={theme.colors.text} />
            {UNREAD_NOTIFICATIONS > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {UNREAD_NOTIFICATIONS > 9 ? '9+' : UNREAD_NOTIFICATIONS}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Progress Report card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.reportLabel}>
            <Ionicons name="stats-chart" size={14} color={theme.colors.primary} />
            <Text style={styles.reportTitle}>Prog. Report</Text>
          </View>
          <Text style={styles.weekly}>Weekly</Text>
        </View>

        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={160}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(193, 68, 14, ${opacity})`,
            labelColor: () => theme.colors.muted,
            barPercentage: 0.5,
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: theme.colors.border,
              strokeWidth: 0.5,
            },
          }}
          style={{ borderRadius: 8, marginLeft: -16 }}
          showBarTops={false}
          fromZero
          withInnerLines
        />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🏅</Text>
          <Text style={styles.statValue}>
            {profile.age ?? '—'}
            <Text style={styles.statUnit}>{profile.age ? 'yr' : ''}</Text>
          </Text>
          <Text style={styles.statLabel}>Current Age</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🏋️</Text>
          <Text style={styles.statValue}>
            {profile.weight_kg ?? '—'}
            <Text style={styles.statUnit}>{profile.weight_kg ? 'kg' : ''}</Text>
          </Text>
          <Text style={styles.statLabel}>Weight</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>
            {profile.daily_intake ?? '—'}
            <Text style={styles.statUnit}>{profile.daily_intake ? 'kalc' : ''}</Text>
          </Text>
          <Text style={styles.statLabel}>Daily Intake</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingBottom: 40 },
  heading: {
    fontSize: theme.fontSize.title, fontWeight: '800',
    color: theme.colors.text, textAlign: 'center',
    paddingTop: 20, marginBottom: 16,
  },
  heroWrapper: { marginHorizontal: theme.spacing.screen, marginBottom: 0 },
  heroCover: {
    borderRadius: 20, overflow: 'hidden', height: 140,
    backgroundColor: theme.colors.card,
  },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarRow: { alignItems: 'center', marginTop: -36 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: theme.colors.bg,
  },
  nameRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 44, marginBottom: 20,
    paddingHorizontal: theme.spacing.screen,
  },
  nameCenter: { flex: 2, alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  location: { fontSize: 12, color: theme.colors.muted, marginTop: 2 },
  gearWrap: { flex: 1, alignItems: 'flex-end' },
  gearBtn: { padding: 4 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.bg,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  card: {
    marginHorizontal: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
    borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border,
    padding: 16, marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  reportLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reportTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  weekly: { fontSize: 12, color: theme.colors.muted },
  statsRow: {
    flexDirection: 'row', marginHorizontal: theme.spacing.screen,
    backgroundColor: theme.colors.card, borderRadius: 16, paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  statUnit: { fontSize: 12, fontWeight: '500', color: theme.colors.muted },
  statLabel: { fontSize: 11, color: theme.colors.muted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: theme.colors.border, marginVertical: 4 },
})