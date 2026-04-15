import { supabase } from '@/lib/supabase'
import { theme } from '@/styles/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'

type Profile = {
  full_name: string
  location: string
  membership: string
  age: string
  weight_kg: string
  daily_intake: string
  avatar_url: string
  cover_url: string
}

const empty: Profile = {
  full_name: '',
  location: '',
  membership: 'Basic Member',
  age: '',
  weight_kg: '',
  daily_intake: '',
  avatar_url: '',
  cover_url: '',
}

export default function PersonalInformationScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile>(empty)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (data) {
        setProfile({
          full_name: data.full_name ?? '',
          location: data.location ?? '',
          membership: data.membership ?? 'Basic Member',
          age: data.age?.toString() ?? '',
          weight_kg: data.weight_kg?.toString() ?? '',
          daily_intake: data.daily_intake?.toString() ?? '',
          avatar_url: data.avatar_url ?? '',
          cover_url: data.cover_url ?? '',
        })
      }
      setLoading(false)
    })()
  }, [])

  const update = (key: keyof Profile, value: string) =>
    setProfile((p) => ({ ...p, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        Alert.alert('Sign in required', 'Please log in first.')
        setSaving(false)
        return
      }

      const payload = {
        id: user.id,
        full_name: profile.full_name.trim() || null,
        location: profile.location.trim() || null,
        membership: profile.membership.trim() || 'Basic Member',
        age: profile.age ? parseInt(profile.age, 10) : null,
        weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
        daily_intake: profile.daily_intake ? parseInt(profile.daily_intake, 10) : null,
        avatar_url: profile.avatar_url.trim() || null,
        cover_url: profile.cover_url.trim() || null,
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })

      if (error) throw error

      Alert.alert('Saved', 'Profile updated.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.white} />
        </Pressable>
        <Text style={styles.heading}>Personal Information</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar preview */}
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri:
                profile.avatar_url || 'https://i.pravatar.cc/100?img=12'+ (profile.full_name || 'guest'),
            }}
            style={styles.avatar}
          />
        </View>

        <Field
          label="Full name"
          value={profile.full_name}
          onChangeText={(v) => update('full_name', v)}
          placeholder="Makise Kurisu"
        />
        <Field
          label="Location"
          value={profile.location}
          onChangeText={(v) => update('location', v)}
          placeholder="Canada, Calgary"
        />
        <Field
          label="Membership"
          value={profile.membership}
          onChangeText={(v) => update('membership', v)}
          placeholder="Basic Member"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Field
              label="Age"
              value={profile.age}
              onChangeText={(v) => update('age', v.replace(/[^0-9]/g, ''))}
              placeholder="17"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.half}>
            <Field
              label="Weight (kg)"
              value={profile.weight_kg}
              onChangeText={(v) => update('weight_kg', v.replace(/[^0-9.]/g, ''))}
              placeholder="68"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Field
          label="Daily intake (kcal)"
          value={profile.daily_intake}
          onChangeText={(v) => update('daily_intake', v.replace(/[^0-9]/g, ''))}
          placeholder="978"
          keyboardType="numeric"
        />

        <Field
          label="Avatar URL"
          value={profile.avatar_url}
          onChangeText={(v) => update('avatar_url', v)}
          placeholder="https://…"
          autoCapitalize="none"
        />
        <Field
          label="Cover image URL"
          value={profile.cover_url}
          onChangeText={(v) => update('cover_url', v)}
          placeholder="https://…"
          autoCapitalize="none"
        />

        <Pressable
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.saveText}>Save changes</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Field({
  label,
  ...inputProps
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.muted}
        {...inputProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: theme.spacing.screen,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: { fontSize: 22, fontWeight: '800', color: theme.colors.white },
  content: {
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 20,
    paddingBottom: 60,
    gap: 8,
  },
  avatarWrap: { alignItems: 'center', marginBottom: 16 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3, borderColor: theme.colors.bg,
    backgroundColor: theme.colors.card,
  },
  field: { marginBottom: 12 },
  fieldLabel: {
    fontSize: 12, fontWeight: '600', color: theme.colors.subtext,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: theme.colors.text,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  saveBtn: {
    marginTop: 16,
    backgroundColor: theme.colors.button,
    borderRadius: theme.radius.button,
    paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  saveText: { color: theme.colors.white, fontWeight: '700', fontSize: 15 },
})