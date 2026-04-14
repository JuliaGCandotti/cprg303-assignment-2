import DiscoverCard from '@/components/discoverCard'
import HorizontalSection from '@/components/horizontalSection'
import { supabase } from '@/lib/supabase'
import { theme } from '@/styles/theme'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

type Workout = {
  id: string
  title: string
  description: string
  level: string
  duration_minutes: number
  image_url: string
  category: string
}

export default function DiscoverScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWorkouts() {
      const { data } = await supabase
        .from('workouts')
        .select('id, title, description, level, duration_minutes, image_url, category')
        .order('category')

      if (data) {
        setWorkouts(data as Workout[])
        setCategories(['All', ...Array.from(new Set(data.map(w => w.category)))])
      }
      setLoading(false)
    }
    fetchWorkouts()
  }, [])

  const filtered = workouts.filter(w => {
    const matchCat = activeCategory === 'All' || w.category === activeCategory
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const grouped = filtered.reduce<Record<string, Workout[]>>((acc, w) => {
    if (!acc[w.category]) acc[w.category] = []
    acc[w.category].push(w)
    return acc
  }, {})

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>Discover</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            placeholderTextColor={theme.colors.muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagContainer}
        >
          {categories.map(cat => {
            const active = activeCategory === cat
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.tag, active && styles.tagActive]}
              >
                <Text style={[styles.tagText, active && styles.tagTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {Object.entries(grouped).map(([cat, items]) => (
          <HorizontalSection key={cat} title={cat}>
            {items.map(item => (
              <DiscoverCard
                key={item.id}
                width={220}
                program={{
                  id: item.id,
                  title: item.title,
                  durationMinutes: item.duration_minutes,
                  level: item.level,
                  image: { uri: item.image_url },
                }}
              />
            ))}
          </HorizontalSection>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.bg },
  scrollContent: { paddingHorizontal: theme.spacing.screen, paddingTop: 16, paddingBottom: 32 },
  heading: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 16,
  },
  searchWrap: { marginBottom: 16 },
  searchInput: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: theme.fontSize.card,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagContainer: { gap: 8, paddingBottom: 20 },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  tagActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  tagText: { fontSize: 13, color: theme.colors.muted, fontWeight: '500' },
  tagTextActive: { color: theme.colors.white, fontWeight: '600' },
  cardWrap: { width: 180 },
})