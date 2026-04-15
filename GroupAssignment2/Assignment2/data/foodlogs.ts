import {supabase} from "@/lib/supabase";

export type FoodLog = {
  id: string;
  title: string;
  calories: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  date: Date;
  imageUrl?: { uri: string };
  note?: string;
};

// Mock data - in a real app this would come from a database
export const initialFoodLogs: FoodLog[] = [
  {
    id: "1",
    date: new Date(2026, 4, 2),
    title: "Grilled chicken with veggies",
    calories: 450,
    carbs: 30,
    protein: 40,
    fat: 15,
    imageUrl: { uri: "https://foodish-api.com/images/burger/burger23.jpg" },
  },
  {
    id: "2",
    date: new Date(2026, 4, 2),
    title: "Protein shake",
    calories: 250,
    carbs: 10,
    protein: 35,
    fat: 5,
    imageUrl: { uri: "https://foodish-api.com/images/pizza/pizza1.jpg" },
  },
  {
    id: "3",
    date: new Date(2026, 3, 5),
    imageUrl: { uri: "https://foodish-api.com/images/burger/burger24.jpg" },
    title: "Cheeseburger with fries",
    calories: 600,
    carbs: 50,
    protein: 30,
    fat: 35,
  },
  {
    id: "4",
    date: new Date(2026, 3, 5),
    imageUrl: { uri: "https://foodish-api.com/images/sushi/sushi1.jpg" },
    title: "Sushi roll",
    calories: 320,
    carbs: 40,
    protein: 20,
    fat: 8,
  },
  {
    id: "5",
    date: new Date(2026, 3, 5),
    imageUrl: { uri: "https://foodish-api.com/images/salad/salad1.jpg" },
    title: "Garden salad with grilled chicken",
    calories: 380,
    carbs: 15,
    protein: 45,
    fat: 12,
  },
  {
    id: "6",
    date: new Date(2026, 2, 15),
    title: "Pasta carbonara",
    calories: 800,
    carbs: 90,
    protein: 35,
    fat: 28,
    imageUrl: { uri: "https://foodish-api.com/images/pasta/pasta1.jpg" },
  },
];

