import { theme } from '@/styles/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
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

export default function MeScreen() {
  const router = useRouter()

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.heading}>Profile</Text>

      {/* Hero cover + avatar popping out */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroCover}>
          <Image
            source={{ uri: 'https://img.freepik.com/free-photo/gym-equipment_53876-14.jpg' }}
            style={styles.coverImage}
          />
        </View>
        <View style={styles.avatarRow}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Name + settings */}
      <View style={styles.nameRow}>
        <View style={{ flex: 1 }} />
        <View style={styles.nameCenter}>
          <Text style={styles.name}>Makise Kurisu</Text>
          <Text style={styles.location}>Canada, Calgary  ·  Basic Member</Text>
        </View>
        <Pressable
          style={styles.gearBtn}
          onPress={() => router.push('/account-settings/page')}
        >
          <Ionicons name="settings-outline" size={22} color={theme.colors.text} />
        </Pressable>
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
          <Text style={styles.statValue}>17<Text style={styles.statUnit}>yr</Text></Text>
          <Text style={styles.statLabel}>Current Age</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🏋️</Text>
          <Text style={styles.statValue}>68<Text style={styles.statUnit}>kg</Text></Text>
          <Text style={styles.statLabel}>Weight</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>978<Text style={styles.statUnit}>kalc</Text></Text>
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
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    paddingTop: 20,
    marginBottom: 16,
  },
  heroWrapper: {
    marginHorizontal: theme.spacing.screen,
    marginBottom: 0,
  },
  heroCover: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 140,
    backgroundColor: theme.colors.card,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarRow: {
    alignItems: 'center',
    marginTop: -36,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: theme.colors.bg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 44,
    marginBottom: 20,
    paddingHorizontal: theme.spacing.screen,
  },
  nameCenter: {
    flex: 2,
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  location: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  gearBtn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  card: {
    marginHorizontal: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  weekly: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.screen,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.muted,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
})