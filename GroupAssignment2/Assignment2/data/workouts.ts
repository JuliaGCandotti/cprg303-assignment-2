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

export const WORKOUTS: Workout[] = [
  {
    id: "belly-fat-burner",
    title: "Belly Fat Burner",
    description:
      "Target stubborn belly fat with this focused core routine. Combining cardio bursts and ab-specific movements, this workout is designed to torch calories and tighten your midsection.\n\nConsistent effort here will lead to a stronger core and a flatter stomach over time.",
    durationMinutes: 10,
    kcal: 95,
    level: "Beginner",
    category: "abs",
    image: {
      uri: "https://img.freepik.com/free-photo/woman-doing-abdominal-exercises_1163-5030.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Jumping Jacks",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/beautiful-blonde-woman-jumping_23-2148343670.jpg",
        },
      },
      {
        id: "e2",
        name: "Crunches",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/fitness-woman-with-slim-body-doing-abdominal-crunches-exercise-mat-home-active-woman-exercising-with-hiit-workout_662251-1328.jpg",
        },
      },
      {
        id: "e3",
        name: "Bicycle Kicks",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/young-woman-dancing-hip-hop_23-2147855977.jpg",
        },
      },
      {
        id: "e4",
        name: "Mountain Climbers",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/female-athlete-practicing-push-ups-burpees-gym_231208-4587.jpg",
        },
      },
      {
        id: "e5",
        name: "Plank Hold",
        durationSeconds: 45,
        image: {
          uri: "https://img.freepik.com/free-photo/young-female-runner-nature_23-2148291426.jpg",
        },
      },
    ],
  },
  {
    id: "lose-fat",
    title: "Lose Fat",
    description:
      "A beginner-friendly full-body fat loss workout. This routine keeps your heart rate elevated with simple movements anyone can follow.\n\nGreat for those just starting their fitness journey or returning after a break.",
    durationMinutes: 10,
    kcal: 110,
    level: "Beginner",
    category: "cardio",
    image: {
      uri: "https://img.freepik.com/free-photo/sid-view-overweight-obese-young-woman-wearing-t-shirt-leggings-doing-physical-training-mat_344912-44.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "High Knees",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/sportive-model-training-outside_23-2147757938.jpg",
        },
      },
      {
        id: "e2",
        name: "Burpees",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/full-shot-sporty-man-exercising_23-2149326158.jpg",
        },
      },
      {
        id: "e3",
        name: "Squat Jumps",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/strong-muscular-build-fitness-woman-sporty-clothes-doing-jump-training-gym_342744-5.jpg",
        },
      },
      {
        id: "e4",
        name: "Lateral Shuffles",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/young-attractive-sporty-man-stretching-morning-workout-city-park_574295-5111.jpg",
        },
      },
    ],
  },
  {
    id: "plank",
    title: "Plank",
    description:
      "Build serious core strength and stability with this plank-focused session. Each variation challenges different muscle groups for a complete core workout.\n\nHold strong — every second counts.",
    durationMinutes: 5,
    kcal: 45,
    level: "Expert",
    category: "abs",
    image: {
      uri: "https://img.freepik.com/free-photo/woman-doing-plank-exercise_1163-5043.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Standard Plank",
        durationSeconds: 60,
        image: {
          uri: "https://img.freepik.com/free-psd/man-yoga-position-isolated_23-2151684565.jpg",
        },
      },
      {
        id: "e2",
        name: "Side Plank Left",
        durationSeconds: 45,
        image: {
          uri: "https://img.freepik.com/free-photo/horizontal-shot-beautiful-brunette-young-female-with-fit-athletic-body-performing-one-handed-side-plank-pose-fitness-mat-gym-sporty-girl-doing-vasisthasana-while-practicing-yoga-indoors_344912-1069.jpg",
        },
      },
      {
        id: "e3",
        name: "Side Plank Right",
        durationSeconds: 45,
        image: {
          uri: "https://img.freepik.com/free-photo/horizontal-shot-beautiful-brunette-young-female-with-fit-athletic-body-performing-one-handed-side-plank-pose-fitness-mat-gym-sporty-girl-doing-vasisthasana-while-practicing-yoga-indoors_344912-1069.jpg",
        },
      },
      {
        id: "e4",
        name: "Plank with Shoulder Taps",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/fitness-sporty-girl-sporty-clothes-is-doing-exercises-wooden-background-light-background-concept-sports_169016-4602.jpg",
        },
      },
    ],
  },
  {
    id: "build-wider-biceps",
    title: "Build Wider Biceps",
    description:
      "Sculpt powerful, well-defined biceps with this targeted upper-body session. Using classic curls and variations, you'll hit every angle of the bicep for maximum growth.\n\nFocus on form over speed for best results.",
    durationMinutes: 30,
    kcal: 180,
    level: "Intermediate",
    category: "arms",
    image: {
      uri: "https://img.freepik.com/free-photo/crossfit-athlete-doing-exercise-with-barbell_58466-11670.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Dumbbell Bicep Curls",
        durationSeconds: 45,
        image: {
          uri: "https://img.freepik.com/free-photo/handsome-man-is-engaged-gym_1157-32097.jpg",
        },
      },
      {
        id: "e2",
        name: "Hammer Curls",
        durationSeconds: 45,
        image: {
          uri: "https://img.freepik.com/free-photo/fitness-girl-lifting-dumbbell_1163-1847.jpg",
        },
      },
      {
        id: "e3",
        name: "Concentration Curls",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/fitness-girl-lifting-dumbbell_1163-1847.jpg",
        },
      },
      {
        id: "e4",
        name: "Reverse Curls",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/strong-man-makin-exercises-triceps-muscular-body-with-free-space-fitness-goods-close-up-shot-training-hands-two-arms-triceps-extension_343059-26.jpg",
        },
      },
      {
        id: "e5",
        name: "21s Barbell Curl",
        durationSeconds: 60,
        image: {
          uri: "https://img.freepik.com/free-photo/strong-woman-exercising-with-barbell_1153-8343.jpg",
        },
      },
    ],
  },
  {
    id: "full-body-workout",
    title: "Full-Body Workout",
    description:
      "Hit every major muscle group in one efficient session. This workout blends strength and cardio for a complete full-body burn.\n\nPerfect for days when you want to get everything done in one go.",
    durationMinutes: 20,
    kcal: 220,
    level: "Advanced",
    category: "full-body",
    image: {
      uri: "https://img.freepik.com/free-photo/woman-doing-her-workout-home_23-2148995612.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Jumping Jacks",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-doing-jumping-jacks_23-2148763684.jpg",
        },
      },
      {
        id: "e2",
        name: "Push-ups",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/beautiful-slim-brunette-doing-push-ups-workout-green-grass-park_8353-8165.jpg",
        },
      },
      {
        id: "e3",
        name: "Squats",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/full-length-young-concentrated-sportsman-doing-squats-workout-outdoors_8353-6839.jpg",
        },
      },
      {
        id: "e4",
        name: "Lunges",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/fitness-confident-woman-white-sports-clothing-sexy-young-beautiful-model-with-perfect-body-female-posing-near-grey-urban-wall-studio-stretching-out-before-training-doing-lunges_158538-23243.jpg",
        },
      },
      {
        id: "e5",
        name: "Plank",
        durationSeconds: 45,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-doing-plank-exercise_1163-5043.jpg",
        },
      },
      {
        id: "e6",
        name: "Burpees",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/full-shot-sporty-man-exercising_23-2149326158.jpg",
        },
      },
    ],
  },
  {
    id: "small-waist-workout",
    title: "Small Waist Workout",
    description:
      "Cinch your waist and strengthen your obliques with this targeted routine. Every move is chosen to whittle the sides and define your midsection.\n\nStay consistent and you'll start seeing results within weeks.",
    durationMinutes: 12,
    kcal: 130,
    level: "Advanced",
    category: "abs",
    image: {
      uri: "https://img.freepik.com/free-photo/side-view-determined-young-woman-holding-slam-ball_662251-1367.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Russian Twists",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/sporty-girl-does-exercises-with-ball-mat-sports-hall_169016-62761.jpg",
        },
      },
      {
        id: "e2",
        name: "Side Crunches Left",
        durationSeconds: 35,
        image: {
          uri: "https://img.freepik.com/free-photo/strong-woman-with-athletic-body-doing-bicycle-crunches-home-her-high-intensity-interval-training-program_662251-1463.jpg",
        },
      },
      {
        id: "e3",
        name: "Side Crunches Right",
        durationSeconds: 35,
        image: {
          uri: "https://img.freepik.com/free-photo/strong-woman-with-athletic-body-doing-bicycle-crunches-home-her-high-intensity-interval-training-program_662251-1463.jpg",
        },
      },
      {
        id: "e4",
        name: "Oblique V-Ups",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-dedicates-weekend-sport-activity-does-side-plank-shows-determination-poses-fitness-mat-urban-setting-wears-top-shorts-practices-yoga_273609-55724.jpg",
        },
      },
      {
        id: "e5",
        name: "Woodchoppers",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/beautiful-athletic-sportswear-girl-stands-gym-with-dumbbells_1157-13769.jpg",
        },
      },
    ],
  },
  {
    id: "lower-body-training",
    title: "Lower Body Training",
    description:
      "The lower abdomen and hips are the most difficult areas of the body to reduce when we are on a diet. Even so, in this area, especially the legs as a whole, you can reduce weight even if you don't use tools.\n\nThis lower body routine targets glutes, quads, hamstrings and calves for a complete leg day.",
    durationMinutes: 20,
    kcal: 95,
    level: "Intermediate",
    category: "legs",
    image: {
      uri: "https://img.freepik.com/free-photo/fitness-woman-pink-sportswear-doing-mountain-climber-exercise_1163-5046.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Jumping Jacks",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-doing-jumping-jacks_23-2148763684.jpg",
        },
      },
      {
        id: "e2",
        name: "Backward Lunge",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-doing-lunges_23-2148763689.jpg",
        },
      },
      {
        id: "e3",
        name: "Glute Bridges",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/happy-woman-doing-pelvic-muscle-exercise-mat_1262-3559.jpg",
        },
      },
      {
        id: "e4",
        name: "Sumo Squats",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-stretching-wide-plie-squat_651396-492.jpg",
        },
      },
      {
        id: "e5",
        name: "Calf Raises",
        durationSeconds: 35,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-s-legs-red-sports-pants-yellow-shoes_613910-16981.jpg",
        },
      },
    ],
  },
  // --- CHALLENGES ---
  {
    id: "challenge-plank",
    title: "Plank Challenge",
    description:
      "28 days of progressive plank training. Each week adds time and difficulty, building a rock-solid core from the ground up.\n\nComplete every day and you'll finish the month as a plank champion.",
    durationMinutes: 8,
    kcal: 60,
    level: "Beginner",
    category: "challenge",
    image: {
      uri: "https://img.freepik.com/free-photo/cheerful-fitness-woman-making-yoga-exercise_171337-7751.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Standard Plank",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-doing-plank-exercise_1163-5043.jpg",
        },
      },
      {
        id: "e2",
        name: "Side Plank Left",
        durationSeconds: 20,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-doing-side-plank_1163-5044.jpg",
        },
      },
      {
        id: "e3",
        name: "Side Plank Right",
        durationSeconds: 20,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-doing-side-plank_1163-5044.jpg",
        },
      },
    ],
  },
  {
    id: "challenge-sprint",
    title: "Sprint Challenge",
    description:
      "High-intensity interval sprints to push your cardiovascular fitness to the next level. Short, brutal, and incredibly effective.\n\nLace up and go all out.",
    durationMinutes: 15,
    kcal: 200,
    level: "Intermediate",
    category: "challenge",
    image: {
      uri: "https://img.freepik.com/free-photo/side-view-determined-young-woman-holding-slam-ball_662251-1367.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Sprint Interval",
        durationSeconds: 20,
        image: {
          uri: "https://img.freepik.com/free-photo/full-length-portrait-strong-half-naked-sportsman-running_171337-9447.jpg",
        },
      },
      {
        id: "e2",
        name: "Rest Walk",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/female-athlete-exercising-street-winter_23-2147905347.jpg",
        },
      },
      {
        id: "e3",
        name: "Sprint Interval",
        durationSeconds: 20,
        image: {
          uri: "https://img.freepik.com/free-photo/full-length-portrait-strong-half-naked-sportsman-running_171337-9447.jpg",
        },
      },
      {
        id: "e4",
        name: "Rest Walk",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/female-athlete-exercising-street-winter_23-2147905347.jpg",
        },
      },
    ],
  },
  {
    id: "challenge-squat",
    title: "Squat Challenge",
    description:
      "30 days of squats. Starting from manageable reps and building up to serious volume, this challenge will transform your legs and glutes.\n\nNo equipment needed — just you and your commitment.",
    durationMinutes: 10,
    kcal: 120,
    level: "Beginner",
    category: "challenge",
    image: {
      uri: "https://img.freepik.com/free-photo/fitness-woman-doing-stretching-exercises_171337-13281.jpg",
    },
    exercises: [
      {
        id: "e1",
        name: "Air Squats",
        durationSeconds: 40,
        image: {
          uri: "https://img.freepik.com/free-photo/close-up-view-young-smile-sportswoman-doing-exercise-home-laptop-karamet_197531-32339.jpg",
        },
      },
      {
        id: "e2",
        name: "Pulse Squats",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/sexy-fitness-woman-green-sports-clothing-with-pink-hairshe-doing-squats-young-beautiful-model-with-perfect-bodyfemale-street-near-roller-shutter-wallcheerful-happy-outdoors_158538-21611.jpg",
        },
      },
      {
        id: "e3",
        name: "Jump Squats",
        durationSeconds: 30,
        image: {
          uri: "https://img.freepik.com/free-photo/sideview-pretty-woman-jumping-high-while-hard-training_176420-7626.jpg",
        },
      },
      {
        id: "e4",
        name: "Sumo Squats",
        durationSeconds: 35,
        image: {
          uri: "https://img.freepik.com/free-photo/woman-stretching-wide-plie-squat_651396-492.jpg",
        },
      },
    ],
  },
];

export function getWorkoutById(id: string): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id);
}