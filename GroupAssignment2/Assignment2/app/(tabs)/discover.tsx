import DiscoverCard from '@/components/discoverCard'
import HeroBanner from '@/components/Herobanner'
import HorizontalSection from '@/components/horizontalSection'
import { supabase } from '@/lib/supabase'
import { theme } from '@/styles/theme'
import { Ionicons } from '@expo/vector-icons'
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
  const [searchFocused, setSearchFocused] = useState(false)

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

  const isSearching = search.length > 0 || activeCategory !== 'All'

  // Trending = first 6 workouts (or all if fewer)
  const trending = workouts.slice(0, 6)

  // Grouped by category for section view
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={styles.heading}>Discover</Text>

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

        {/* Search bar */}
        <View style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}>
          <Ionicons
            name="search-outline"
            size={18}
            color={theme.colors.muted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={theme.colors.muted}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <Pressable style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color={theme.colors.text} />
          </Pressable>
        </View>

        {/* Hero banner — only shown when not actively searching */}
        {!isSearching && (
          <HeroBanner
            title="CrossFit"
            subtitle="Build strength & endurance"
            workoutId={trending[0]?.id}
          />
        )}

        {/* Trending section — horizontal scroll, only when not searching */}
        {!isSearching && trending.length > 0 && (
          <HorizontalSection title="Trending courses" showSeeAll>
            {trending.map(item => (
              <DiscoverCard
                key={item.id}
                width={170}
                program={{
                  id: item.id,
                  title: item.title,
                  durationMinutes: item.duration_minutes,
                  level: item.level,
                  image: { uri: item.image_url },
                }}
                variant="horizontal"
              />
            ))}
          </HorizontalSection>
        )}

        {/* Filtered / category content — grid layout */}
        {isSearching ? (
          <View>
            {activeCategory !== 'All' && (
              <Text style={styles.sectionLabel}>{activeCategory}</Text>
            )}
            <View style={styles.grid}>
              {filtered.map(item => (
                <DiscoverCard
                  key={item.id}
                  program={{
                    id: item.id,
                    title: item.title,
                    durationMinutes: item.duration_minutes,
                    level: item.level,
                    image: { uri: item.image_url },
                  }}
                  variant="grid"
                />
              ))}
            </View>
            {filtered.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No workouts found</Text>
              </View>
            )}
          </View>
        ) : (
          /* Default: all categories as horizontal sections */
          Object.entries(grouped).map(([cat, items]) => (
            <HorizontalSection key={cat} title={cat} showSeeAll>
              {items.map(item => (
                <DiscoverCard
                  key={item.id}
                  width={170}
                  program={{
                    id: item.id,
                    title: item.title,
                    durationMinutes: item.duration_minutes,
                    level: item.level,
                    image: { uri: item.image_url },
                  }}
                  variant="horizontal"
                />
              ))}
            </HorizontalSection>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  /* Category pills */
  tagContainer: {
    gap: 8,
    paddingBottom: 16,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  tagActive: {
    backgroundColor: theme.colors.tagActiveBg,
    borderColor: theme.colors.tagActiveBg,
  },
  tagText: {
    fontSize: 13,
    color: theme.colors.muted,
    fontWeight: '500',
  },
  tagTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },

  /* Search bar */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 46,
  },
  searchWrapFocused: {
    borderColor: theme.colors.tagActiveBg,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.card,
    color: theme.colors.text,
    height: '100%',
  },
  filterBtn: {
    marginLeft: 8,
    padding: 4,
  },

  /* Section label for category mode */
  sectionLabel: {
    fontSize: theme.fontSize.section,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 14,
  },

  /* Grid layout for search/filter results */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  /* Empty state */
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.card,
    color: theme.colors.muted,
  },
})