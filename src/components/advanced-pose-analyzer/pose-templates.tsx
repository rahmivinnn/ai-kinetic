import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, StarOff, Download, Share2 } from 'lucide-react';

// Sample template data
const sampleTemplates = [
  { 
    id: 1, 
    name: "Proper Squat Form", 
    category: "Strength", 
    difficulty: "Beginner",
    favorite: true,
    thumbnail: "/templates/squat.jpg" 
  },
  { 
    id: 2, 
    name: "Deadlift Posture", 
    category: "Strength", 
    difficulty: "Intermediate",
    favorite: false,
    thumbnail: "/templates/deadlift.jpg" 
  },
  { 
    id: 3, 
    name: "Yoga Warrior Pose", 
    category: "Flexibility", 
    difficulty: "Beginner",
    favorite: true,
    thumbnail: "/templates/warrior.jpg" 
  },
  { 
    id: 4, 
    name: "Plank Position", 
    category: "Core", 
    difficulty: "Beginner",
    favorite: false,
    thumbnail: "/templates/plank.jpg" 
  },
  { 
    id: 5, 
    name: "Overhead Press", 
    category: "Strength", 
    difficulty: "Intermediate",
    favorite: false,
    thumbnail: "/templates/press.jpg" 
  },
  { 
    id: 6, 
    name: "Running Form", 
    category: "Cardio", 
    difficulty: "Beginner",
    favorite: false,
    thumbnail: "/templates/running.jpg" 
  },
];

const PoseTemplates = () => {
  const [templates, setTemplates] = useState(sampleTemplates);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter templates based on active category and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === "all" || template.category.toLowerCase() === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, favorite: !template.favorite } : template
    ));
  };
  
  return (
    <div className="pose-templates">
      <div className="search-and-filter mb-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            New Template
          </Button>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="bg-blue-50 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              All
            </TabsTrigger>
            <TabsTrigger value="strength" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Strength
            </TabsTrigger>
            <TabsTrigger value="flexibility" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Flexibility
            </TabsTrigger>
            <TabsTrigger value="core" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Core
            </TabsTrigger>
            <TabsTrigger value="cardio" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Cardio
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="templates-grid grid grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="template-thumbnail bg-gray-200 aspect-video relative">
                {/* Placeholder for template thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  {template.name}
                </div>
                
                <button 
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                  onClick={() => toggleFavorite(template.id)}
                >
                  {template.favorite ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="template-info p-3">
                <h3 className="font-medium text-sm">{template.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {template.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                    {template.difficulty}
                  </Badge>
                </div>
                
                <div className="template-actions flex justify-between mt-3">
                  <Button variant="outline" size="sm" className="text-xs px-2">
                    <Download className="h-3 w-3 mr-1" />
                    Use
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs px-2">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PoseTemplates;
