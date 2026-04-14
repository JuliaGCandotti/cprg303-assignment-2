import { theme } from '@/styles/theme'
import { useRouter } from 'expo-router'
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
  title?: string
  subtitle?: string
  imageUri?: string
  workoutId?: string
}

export default function HeroBanner({
  title = 'CrossFit',
  subtitle = 'Get stronger every day',
  imageUri,
  workoutId,
}: Props) {
  const router = useRouter()

  return (
    <ImageBackground
     source={{ uri: imageUri ?? 'https://img.freepik.com/free-photo/boxing-ring-gym_53876-144329.jpg' }}
      style={styles.hero}
      imageStyle={styles.heroImage}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Pressable
          style={styles.cta}
          onPress={() => workoutId && router.push(`/workout/${workoutId}`)}
        >
          <Text style={styles.ctaText}>Start Now</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  hero: {
    height: 200,
    borderRadius: theme.radius.hero,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: theme.colors.heroBg,
    justifyContent: 'flex-end',
  },
  heroImage: {
    borderRadius: theme.radius.hero,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: theme.radius.hero,
  },
  content: {
    padding: 20,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 10,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
})