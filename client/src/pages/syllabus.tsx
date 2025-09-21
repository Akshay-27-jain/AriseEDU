import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star, 
  Play,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  Target,
  Award,
  Zap,
  Leaf,
  Users,
  Globe,
  BookMarked,
  FileText,
  Video,
  Music,
  Image,
  Code,
  Calculator,
  Microscope,
  Globe2,
  History,
  Palette,
  Dumbbell
} from 'lucide-react';
import { BottomNavigation } from '@/components/bottom-navigation';
import { cn } from '@/lib/utils';

export default function SyllabusPage() {
  const [activeTab, setActiveTab] = useState('subjects');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // Sample syllabus data
  const classes = [
    { id: '8', name: 'Class 8', students: 1250 },
    { id: '9', name: 'Class 9', students: 1180 },
    { id: '10', name: 'Class 10', students: 1350, selected: true },
    { id: '11', name: 'Class 11', students: 980 },
    { id: '12', name: 'Class 12', students: 1100 }
  ];

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'bg-blue-500',
      description: 'Algebra, Geometry, Trigonometry, Calculus',
      totalTopics: 25,
      completedTopics: 18,
      totalLessons: 120,
      completedLessons: 85,
      difficulty: 'medium',
      estimatedTime: '40 hours',
      languages: ['English', 'Hindi', 'Tamil', 'Telugu']
    },
    {
      id: 'science',
      name: 'Science',
      icon: Microscope,
      color: 'bg-green-500',
      description: 'Physics, Chemistry, Biology',
      totalTopics: 30,
      completedTopics: 22,
      totalLessons: 150,
      completedLessons: 95,
      difficulty: 'medium',
      estimatedTime: '45 hours',
      languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali']
    },
    {
      id: 'english',
      name: 'English',
      icon: BookOpen,
      color: 'bg-purple-500',
      description: 'Grammar, Literature, Writing Skills',
      totalTopics: 20,
      completedTopics: 15,
      totalLessons: 80,
      completedLessons: 60,
      difficulty: 'easy',
      estimatedTime: '30 hours',
      languages: ['English', 'Hindi']
    },
    {
      id: 'social-science',
      name: 'Social Science',
      icon: Globe2,
      color: 'bg-orange-500',
      description: 'History, Geography, Civics, Economics',
      totalTopics: 35,
      completedTopics: 20,
      totalLessons: 140,
      completedLessons: 75,
      difficulty: 'easy',
      estimatedTime: '35 hours',
      languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi']
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      icon: Code,
      color: 'bg-indigo-500',
      description: 'Programming, Data Structures, Algorithms',
      totalTopics: 15,
      completedTopics: 8,
      totalLessons: 60,
      completedLessons: 35,
      difficulty: 'hard',
      estimatedTime: '25 hours',
      languages: ['English', 'Hindi']
    },
    {
      id: 'physical-education',
      name: 'Physical Education',
      icon: Dumbbell,
      color: 'bg-red-500',
      description: 'Sports, Health, Fitness',
      totalTopics: 10,
      completedTopics: 6,
      totalLessons: 40,
      completedLessons: 25,
      difficulty: 'easy',
      estimatedTime: '20 hours',
      languages: ['English', 'Hindi', 'Tamil', 'Telugu']
    }
  ];

  const topics = {
    mathematics: [
      {
        id: 'algebra',
        name: 'Algebra',
        description: 'Linear equations, quadratic equations, polynomials',
        lessons: 15,
        completed: 12,
        difficulty: 'medium',
        estimatedTime: '8 hours',
        resources: [
          { type: 'video', title: 'Introduction to Algebra', duration: '15 min', completed: true },
          { type: 'text', title: 'Algebra Basics', pages: 25, completed: true },
          { type: 'quiz', title: 'Algebra Quiz', questions: 20, completed: true },
          { type: 'practice', title: 'Practice Problems', problems: 50, completed: false }
        ]
      },
      {
        id: 'geometry',
        name: 'Geometry',
        description: 'Triangles, circles, polygons, coordinate geometry',
        lessons: 20,
        completed: 15,
        difficulty: 'medium',
        estimatedTime: '12 hours',
        resources: [
          { type: 'video', title: 'Basic Geometry Concepts', duration: '20 min', completed: true },
          { type: 'text', title: 'Geometry Textbook', pages: 40, completed: true },
          { type: 'quiz', title: 'Geometry Quiz', questions: 25, completed: false },
          { type: 'practice', title: 'Construction Problems', problems: 30, completed: false }
        ]
      },
      {
        id: 'trigonometry',
        name: 'Trigonometry',
        description: 'Trigonometric ratios, identities, graphs',
        lessons: 12,
        completed: 8,
        difficulty: 'hard',
        estimatedTime: '10 hours',
        resources: [
          { type: 'video', title: 'Trigonometry Basics', duration: '25 min', completed: true },
          { type: 'text', title: 'Trigonometry Guide', pages: 30, completed: false },
          { type: 'quiz', title: 'Trigonometry Quiz', questions: 15, completed: false },
          { type: 'practice', title: 'Trigonometry Problems', problems: 40, completed: false }
        ]
      }
    ],
    science: [
      {
        id: 'physics',
        name: 'Physics',
        description: 'Mechanics, thermodynamics, waves, electricity',
        lessons: 25,
        completed: 18,
        difficulty: 'hard',
        estimatedTime: '15 hours',
        resources: [
          { type: 'video', title: 'Physics Fundamentals', duration: '30 min', completed: true },
          { type: 'text', title: 'Physics Textbook', pages: 60, completed: true },
          { type: 'quiz', title: 'Physics Quiz', questions: 30, completed: true },
          { type: 'experiment', title: 'Virtual Lab', experiments: 10, completed: false }
        ]
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Atomic structure, chemical bonding, reactions',
        lessons: 20,
        completed: 12,
        difficulty: 'medium',
        estimatedTime: '12 hours',
        resources: [
          { type: 'video', title: 'Chemistry Basics', duration: '25 min', completed: true },
          { type: 'text', title: 'Chemistry Guide', pages: 45, completed: false },
          { type: 'quiz', title: 'Chemistry Quiz', questions: 25, completed: false },
          { type: 'experiment', title: 'Chemistry Lab', experiments: 8, completed: false }
        ]
      },
      {
        id: 'biology',
        name: 'Biology',
        description: 'Cell biology, genetics, evolution, ecology',
        lessons: 22,
        completed: 16,
        difficulty: 'medium',
        estimatedTime: '14 hours',
        resources: [
          { type: 'video', title: 'Biology Introduction', duration: '20 min', completed: true },
          { type: 'text', title: 'Biology Textbook', pages: 50, completed: true },
          { type: 'quiz', title: 'Biology Quiz', questions: 28, completed: true },
          { type: 'diagram', title: 'Interactive Diagrams', diagrams: 15, completed: false }
        ]
      }
    ]
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getResourceIcon = (type) => {
    const icons = {
      video: Video,
      text: FileText,
      quiz: Target,
      practice: Calculator,
      experiment: Microscope,
      diagram: Image
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || subject.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="gradient-bg text-white py-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Syllabus</h1>
            <p className="text-white/80">Your complete learning roadmap</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">Class {selectedClass}</div>
            <div className="text-sm text-white/80">Current Class</div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="flex space-x-2 overflow-x-auto">
          {classes.map((cls) => (
            <Button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              variant={cls.id === selectedClass ? "default" : "outline"}
              className={cn(
                "whitespace-nowrap",
                cls.id === selectedClass ? "bg-white text-blue-600" : "bg-white/20 text-white border-white/30"
              )}
            >
              {cls.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => {
                const Icon = subject.icon;
                const progress = (subject.completedTopics / subject.totalTopics) * 100;
                
                return (
                  <Card 
                    key={subject.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setActiveTab('topics');
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={getDifficultyColor(subject.difficulty)}>
                          {subject.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{subject.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{subject.completedTopics}/{subject.totalTopics} topics</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Lessons</div>
                            <div className="font-semibold">{subject.completedLessons}/{subject.totalLessons}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Time</div>
                            <div className="font-semibold">{subject.estimatedTime}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {subject.languages.slice(0, 3).map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                          {subject.languages.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{subject.languages.length - 3}
                            </Badge>
                          )}
                        </div>

                        <Button className="w-full mt-4">
                          <Play className="w-4 h-4 mr-2" />
                          Start Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics" className="space-y-6">
            {selectedSubject ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {subjects.find(s => s.id === selectedSubject)?.name} Topics
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedSubject(null)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View All Subjects
                  </Button>
                </div>

                {topics[selectedSubject]?.map((topic) => {
                  const progress = (topic.completed / topic.lessons) * 100;
                  
                  return (
                    <Card key={topic.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{topic.name}</h3>
                              <p className="text-sm text-muted-foreground">{topic.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getDifficultyColor(topic.difficulty)}>
                              {topic.difficulty}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {topic.estimatedTime}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{topic.completed}/{topic.lessons} lessons</span>
                          </div>
                          <Progress value={progress} className="h-2" />

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {topic.resources.map((resource, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                {getResourceIcon(resource.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{resource.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {resource.type === 'video' && resource.duration}
                                    {resource.type === 'text' && `${resource.pages} pages`}
                                    {resource.type === 'quiz' && `${resource.questions} questions`}
                                    {resource.type === 'practice' && `${resource.problems} problems`}
                                    {resource.type === 'experiment' && `${resource.experiments} experiments`}
                                    {resource.type === 'diagram' && `${resource.diagrams} diagrams`}
                                  </div>
                                </div>
                                {resource.completed && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                            ))}
                          </div>

                          <Button className="w-full mt-4">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Subject</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a subject from the Subjects tab to view its topics and resources.
                  </p>
                  <Button onClick={() => setActiveTab('subjects')}>
                    Browse Subjects
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Video Lessons</CardTitle>
                      <p className="text-sm text-muted-foreground">Interactive video content</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Videos</span>
                      <span>150</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Watched</span>
                      <span>95</span>
                    </div>
                    <Progress value={63} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Text Resources</CardTitle>
                      <p className="text-sm text-muted-foreground">PDFs and documents</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Documents</span>
                      <span>80</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Read</span>
                      <span>45</span>
                    </div>
                    <Progress value={56} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Quizzes</CardTitle>
                      <p className="text-sm text-muted-foreground">Practice tests and assessments</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Quizzes</span>
                      <span>60</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>38</span>
                    </div>
                    <Progress value={63} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Microscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Virtual Labs</CardTitle>
                      <p className="text-sm text-muted-foreground">Interactive experiments</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Experiments</span>
                      <span>25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>12</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Diagrams</CardTitle>
                      <p className="text-sm text-muted-foreground">Interactive visual aids</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Diagrams</span>
                      <span>40</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Explored</span>
                      <span>22</span>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Downloads</CardTitle>
                      <p className="text-sm text-muted-foreground">Offline content</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Available</span>
                      <span>120</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Downloaded</span>
                      <span>65</span>
                    </div>
                    <Progress value={54} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="syllabus" />
    </div>
  );
}

