"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  title: string;
  description: string;
  exerciseCount: number;
  image?: string;
}

interface RecommendedItem {
  id: string;
  title: string;
  description: string;
  image?: string;
}

const prescribedCategories: Category[] = [
  {
    id: "1",
    title: "Knee Rehabilitation",
    description: "12 exercises tailored for your recovery",
    exerciseCount: 12,
    image: "/images/exercises/knee-rehab.jpg",
  },
  {
    id: "2",
    title: "Lower Back",
    description: "8 exercises to improve mobility",
    exerciseCount: 8,
    image: "/images/exercises/lower-back.jpg",
  },
  {
    id: "3",
    title: "Posture Correction",
    description: "5 exercises for better alignment",
    exerciseCount: 5,
    image: "/images/exercises/posture.jpg",
  },
];

const allCategories: Category[] = [
  {
    id: "4",
    title: "Shoulder",
    description: "15 exercises for shoulder mobility",
    exerciseCount: 15,
    image: "/images/exercises/shoulder.jpg",
  },
  {
    id: "5",
    title: "Hip Mobility",
    description: "10 exercises for hip flexibility",
    exerciseCount: 10,
    image: "/images/exercises/hip-mobility.jpg",
  },
  {
    id: "6",
    title: "Balance",
    description: "8 exercises to improve stability",
    exerciseCount: 8,
    image: "/images/exercises/balance.jpg",
  },
  {
    id: "7",
    title: "Wrist & Hand",
    description: "6 exercises for fine motor skills",
    exerciseCount: 6,
    image: "/images/exercises/wrist-hand.jpg",
  },
  {
    id: "8",
    title: "Neck",
    description: "7 exercises for neck tension relief",
    exerciseCount: 7,
    image: "/images/exercises/neck.jpg",
  },
  {
    id: "9",
    title: "Core Strength",
    description: "12 exercises for core stability",
    exerciseCount: 12,
    image: "/images/exercises/core.jpg",
  },
  {
    id: "10",
    title: "Ankle & Foot",
    description: "9 exercises for ankle mobility",
    exerciseCount: 9,
    image: "/images/exercises/ankle-foot.jpg",
  },
  {
    id: "11",
    title: "Aquatic Therapy",
    description: "Water-based rehabilitation",
    exerciseCount: 8,
    image: "/images/exercises/aquatic.jpg",
  },
];

const recommendedItems: RecommendedItem[] = [
  {
    id: "1",
    title: "Stretching Fundamentals",
    description: "Basic stretches for overall flexibility",
    image: "/images/exercises/stretching.jpg",
  },
  {
    id: "2",
    title: "Pain Management",
    description: "Gentle exercises for reducing discomfort",
    image: "/images/exercises/pain-management.jpg",
  },
  {
    id: "3",
    title: "Strength Building",
    description: "Progressive resistance training",
    image: "/images/exercises/strength.jpg",
  },
];

export default function ExerciseCategories() {
  return (
    <div className="space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Exercise Categories</h1>
        <p className="text-sm text-muted-foreground">
          Select a category to view specific exercises
        </p>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search categories..."
          className="w-full"
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Prescribed Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prescribedCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  <img 
                    src={category.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=350&fit=crop"} 
                    alt={category.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=350&fit=crop";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-sm font-medium text-white">{category.exerciseCount} exercises</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <Button variant="default" className="w-full">
                    View Exercises
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Categories</h2>
          <div className="flex space-x-2 text-sm text-muted-foreground">
            <Tabs
              defaultValue="all"
              className="flex space-x-2 text-sm text-muted-foreground"
            >
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="upper"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  Upper Body
                </TabsTrigger>
                <TabsTrigger
                  value="lower"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  Lower Body
                </TabsTrigger>
                <TabsTrigger
                  value="core"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  Core
                </TabsTrigger>
                <TabsTrigger
                  value="mobility"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  Mobility
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {allCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <div className="relative h-32 w-full">
                  <img 
                    src={category.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=350&fit=crop"} 
                    alt={category.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=350&fit=crop";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-xs font-medium text-white">{category.exerciseCount} exercises</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <Button variant="default" className="w-full mt-2">
                    View Exercises
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recommended For You</h2>
          <div className="space-y-2">
            {recommendedItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop"} 
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop";
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
