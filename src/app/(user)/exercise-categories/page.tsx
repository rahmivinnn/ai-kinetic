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
}

interface RecommendedItem {
  id: string;
  title: string;
  description: string;
}

const prescribedCategories: Category[] = [
  {
    id: "1",
    title: "Knee Rehabilitation",
    description: "12 exercises tailored for your recovery",
    exerciseCount: 12,
  },
  {
    id: "2",
    title: "Lower Back",
    description: "8 exercises to improve mobility",
    exerciseCount: 8,
  },
  {
    id: "3",
    title: "Posture Correction",
    description: "5 exercises for better alignment",
    exerciseCount: 5,
  },
];

const allCategories: Category[] = [
  {
    id: "4",
    title: "Shoulder",
    description: "15 exercises for shoulder mobility",
    exerciseCount: 15,
  },
  {
    id: "5",
    title: "Hip Mobility",
    description: "10 exercises for hip flexibility",
    exerciseCount: 10,
  },
  {
    id: "6",
    title: "Balance",
    description: "8 exercises to improve stability",
    exerciseCount: 8,
  },
  {
    id: "7",
    title: "Wrist & Hand",
    description: "6 exercises for fine motor skills",
    exerciseCount: 6,
  },
  {
    id: "8",
    title: "Neck",
    description: "7 exercises for neck tension relief",
    exerciseCount: 7,
  },
  {
    id: "9",
    title: "Core Strength",
    description: "12 exercises for core stability",
    exerciseCount: 12,
  },
  {
    id: "10",
    title: "Ankle & Foot",
    description: "9 exercises for ankle mobility",
    exerciseCount: 9,
  },
  {
    id: "11",
    title: "Aquatic Therapy",
    description: "Water-based rehabilitation",
    exerciseCount: 8,
  },
];

const recommendedItems: RecommendedItem[] = [
  {
    id: "1",
    title: "Stretching Fundamentals",
    description: "Basic stretches for overall flexibility",
  },
  {
    id: "2",
    title: "Pain Management",
    description: "Gentle exercises for reducing discomfort",
  },
  {
    id: "3",
    title: "Strength Building",
    description: "Progressive resistance training",
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
              <Card key={category.id} className="p-6">
                <div className="space-y-4">
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
              <Card key={category.id} className="p-6">
                <div className="space-y-4">
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
          <h2 className="text-lg font-semibold">Recommended For You</h2>
          <div className="space-y-2">
            {recommendedItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
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
