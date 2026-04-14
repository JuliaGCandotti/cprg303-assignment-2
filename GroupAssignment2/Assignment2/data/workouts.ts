// lib/workouts.ts
// Drop-in replacement for data/workouts.ts that pulls from Supabase
// but returns the SAME shape your components already use.

import { supabase } from "@/lib/supabase";

export type Exercise = {
  id: string;
  name: string;
  durationSeconds: number;
  image: { uri: string };
};

export type Workout = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  kcal: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
  image: { uri: string };
  exercises: Exercise[];
};

// ---------- row → app shape ----------
type WorkoutRow = {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  kcal: number;
  level: Workout["level"];
  category: string;
  image_url: string;
};

type ExerciseRow = {
  workout_id: string;
  local_id: string;
  name: string;
  duration_seconds: number;
  image_url: string;
  sort_order: number;
};

function toWorkout(w: WorkoutRow, exs: ExerciseRow[]): Workout {
  return {
    id: w.id,
    title: w.title,
    description: w.description,
    durationMinutes: w.duration_minutes,
    kcal: w.kcal,
    level: w.level,
    category: w.category,
    image: { uri: w.image_url },
    exercises: exs
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((e) => ({
        id: e.local_id,
        name: e.name,
        durationSeconds: e.duration_seconds,
        image: { uri: e.image_url },
      })),
  };
}

// ---------- public API ----------

export async function getAllWorkouts(): Promise<Workout[]> {
  const [{ data: ws, error: wErr }, { data: es, error: eErr }] =
    await Promise.all([
      supabase.from("workouts").select("*").order("created_at"),
      supabase.from("exercises").select("*"),
    ]);

  if (wErr) throw wErr;
  if (eErr) throw eErr;

  const grouped: Record<string, ExerciseRow[]> = {};
  (es ?? []).forEach((e: ExerciseRow) => {
    (grouped[e.workout_id] ||= []).push(e);
  });

  return (ws ?? []).map((w: WorkoutRow) => toWorkout(w, grouped[w.id] ?? []));
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  const [{ data: w, error: wErr }, { data: es, error: eErr }] =
    await Promise.all([
      supabase.from("workouts").select("*").eq("id", id).maybeSingle(),
      supabase.from("exercises").select("*").eq("workout_id", id),
    ]);

  if (wErr) throw wErr;
  if (eErr) throw eErr;
  if (!w) return null;

  return toWorkout(w as WorkoutRow, (es ?? []) as ExerciseRow[]);
}

export async function getWorkoutsByCategory(
  category: string,
): Promise<Workout[]> {
  const all = await getAllWorkouts();
  return all.filter((w) => w.category === category);
}

export async function getChallenges(): Promise<Workout[]> {
  return getWorkoutsByCategory("challenge");
}