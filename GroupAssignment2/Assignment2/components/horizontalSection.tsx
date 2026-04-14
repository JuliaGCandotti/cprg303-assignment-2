import { theme } from '@/styles/theme'
import { ReactNode } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

type Props = {
  title: string
  showSeeAll?: boolean
  onSeeAll?: () => void
  children: ReactNode
}

export default function HorizontalSection({
  title,
  showSeeAll = true,
  onSeeAll,
  children,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showSeeAll && (
          <Pressable onPress={onSeeAll}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: theme.fontSize.section,
    fontWeight: '700',
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: theme.fontSize.small,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  row: {
    gap: 12,
    paddingRight: 4,
  },
})