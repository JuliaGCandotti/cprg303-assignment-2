import { supabase } from '@/lib/supabase'
import { theme } from '@/styles/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'

// keep this in sync with me.tsx (or lift to a shared hook later)
const UNREAD_NOTIFICATIONS = 8

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  badge?: number
  onPress?: () => void
}

function SettingsRow({ icon, label, badge, onPress }: RowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={20} color={theme.colors.subtext} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      {badge && badge > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={16} color={theme.colors.muted} />
    </Pressable>
  )
}

export default function AccountSettingsScreen() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setSigningOut(true)
              const { error } = await supabase.auth.signOut()
              if (error) throw error
              router.replace('/login')
            } catch (err) {
              Alert.alert('Error', 'Could not sign out. Please try again.')
            } finally {
              setSigningOut(false)
            }
          },
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.white} />
        </Pressable>
        <Text style={styles.heading}>Account Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="notifications-outline"
            label="Notification"
            badge={UNREAD_NOTIFICATIONS}
            onPress={() => router.push('/notifications/page')}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="person-outline"
            label="Personal Information"
            onPress={() => router.push('/personal-information/page')}
          />
          <View style={styles.divider} />

          <View style={styles.row}>
            <Ionicons
              name="moon-outline"
              size={20}
              color={theme.colors.subtext}
              style={styles.rowIcon}
            />
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
          <View style={styles.divider} />

          <SettingsRow icon="hardware-chip-outline" label="Linked Devices" />
        </View>

        <Text style={styles.sectionTitle}>Security & Privacy</Text>
        <View style={styles.section}>
          <SettingsRow icon="shield-outline" label="Main Security" />
        </View>

        <Pressable
          style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutPressed]}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 52, paddingBottom: 24,
    paddingHorizontal: theme.spacing.screen,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    gap: 16,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  heading: { fontSize: 22, fontWeight: '800', color: theme.colors.white },
  content: {
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 24, paddingBottom: 40, gap: 8,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: theme.colors.subtext,
    marginBottom: 8, marginTop: 8,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  section: {
    backgroundColor: theme.colors.bg,
    borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border,
    overflow: 'hidden', marginBottom: 8,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowIcon: { marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 15, color: theme.colors.text, fontWeight: '500' },
  divider: { height: 0.5, backgroundColor: theme.colors.border, marginLeft: 48 },
  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: '#dc2626',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 6, marginRight: 8,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.bg,
  },
  signOutPressed: { opacity: 0.7 },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
})