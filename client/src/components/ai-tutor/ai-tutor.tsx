import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Lightbulb, 
  BookOpen, 
  Calculator,
  Microscope,
  Globe,
  MessageCircle,
  Send,
  Loader2,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIHint {
  id: string;
  type: 'concept' | 'method' | 'example' | 'encouragement';
  content: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isUsed: boolean;
}

interface AITutorProps {
  currentSubject: string;
  currentQuestion: string;
  userAttempts: number;
  onHintUsed: (hintId: string) => void;
  onRequestHelp: (question: string) => void;
  className?: string;
}

export function AITutor({ 
  currentSubject, 
  currentQuestion, 
  userAttempts, 
  onHintUsed, 
  onRequestHelp,
  className 
}: AITutorProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [currentHint, setCurrentHint] = useState<AIHint | null>(null);
  const [hintHistory, setHintHistory] = useState<AIHint[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Generate contextual hints based on subject and question
  const generateHint = async (subject: string, question: string, attempts: number) => {
    setIsThinking(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const hints = getHintsForSubject(subject, question, attempts);
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    setCurrentHint(randomHint);
    setHintHistory(prev => [...prev, randomHint]);
    setIsThinking(false);
  };

  const getHintsForSubject = (subject: string, question: string, attempts: number): AIHint[] => {
    const baseHints = {
      math: [
        {
          id: 'math_concept_1',
          type: 'concept' as const,
          content: 'Remember the order of operations: PEMDAS (Parentheses, Exponents, Multiplication, Division, Addition, Subtraction)',
          subject: 'math',
          difficulty: 'easy' as const,
          isUsed: false
        },
        {
          id: 'math_method_1',
          type: 'method' as const,
          content: 'Try breaking down the problem into smaller steps. What do you need to find first?',
          subject: 'math',
          difficulty: 'easy' as const,
          isUsed: false
        },
        {
          id: 'math_example_1',
          type: 'example' as const,
          content: 'Think of a similar problem you\'ve solved before. How did you approach it?',
          subject: 'math',
          difficulty: 'medium' as const,
          isUsed: false
        }
      ],
      science: [
        {
          id: 'science_concept_1',
          type: 'concept' as const,
          content: 'Consider the scientific method: observe, hypothesize, experiment, analyze, conclude',
          subject: 'science',
          difficulty: 'easy' as const,
          isUsed: false
        },
        {
          id: 'science_method_1',
          type: 'method' as const,
          content: 'What are the key variables in this problem? What relationships exist between them?',
          subject: 'science',
          difficulty: 'medium' as const,
          isUsed: false
        },
        {
          id: 'science_example_1',
          type: 'example' as const,
          content: 'Think about real-world examples of this concept. How does it apply in everyday life?',
          subject: 'science',
          difficulty: 'easy' as const,
          isUsed: false
        }
      ],
      language: [
        {
          id: 'language_concept_1',
          type: 'concept' as const,
          content: 'Consider the context clues in the text. What do the surrounding words tell you?',
          subject: 'language',
          difficulty: 'easy' as const,
          isUsed: false
        },
        {
          id: 'language_method_1',
          type: 'method' as const,
          content: 'Break down the word into its parts. Look for prefixes, roots, and suffixes.',
          subject: 'language',
          difficulty: 'medium' as const,
          isUsed: false
        },
        {
          id: 'language_example_1',
          type: 'example' as const,
          content: 'Think of similar words you know. What patterns do you notice?',
          subject: 'language',
          difficulty: 'easy' as const,
          isUsed: false
        }
      ]
    };

    const subjectHints = baseHints[subject as keyof typeof baseHints] || baseHints.math;
    
    // Add encouragement hints based on attempts
    if (attempts > 2) {
      subjectHints.push({
        id: `encouragement_${attempts}`,
        type: 'encouragement' as const,
        content: 'You\'re doing great! Take your time and think through each step carefully.',
        subject,
        difficulty: 'easy' as const,
        isUsed: false
      });
    }

    return subjectHints;
  };

  const handleGetHint = () => {
    generateHint(currentSubject, currentQuestion, userAttempts);
  };

  const handleUseHint = () => {
    if (currentHint) {
      onHintUsed(currentHint.id);
      setCurrentHint(null);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      onRequestHelp(chatMessage);
      setChatMessage('');
    }
  };

  const getSubjectIcon = (subject: string) => {
    const icons = {
      math: Calculator,
      science: Microscope,
      language: BookOpen,
      general: Globe
    };
    return icons[subject as keyof typeof icons] || Globe;
  };

  const getHintTypeColor = (type: string) => {
    const colors = {
      concept: 'bg-blue-100 text-blue-800',
      method: 'bg-green-100 text-green-800',
      example: 'bg-purple-100 text-purple-800',
      encouragement: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getHintTypeIcon = (type: string) => {
    const icons = {
      concept: BookOpen,
      method: Target,
      example: Lightbulb,
      encouragement: Sparkles
    };
    return icons[type as keyof typeof icons] || Lightbulb;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* AI Tutor Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>AI Tutor Assistant</CardTitle>
                <p className="text-sm text-muted-foreground">I'm here to help you learn!</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Current Hint */}
      {currentHint && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getHintTypeColor(currentHint.type)}>
                    {currentHint.type.charAt(0).toUpperCase() + currentHint.type.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {currentHint.difficulty.charAt(0).toUpperCase() + currentHint.difficulty.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{currentHint.content}</p>
                <Button onClick={handleUseHint} size="sm" className="bg-blue-500 hover:bg-blue-600">
                  <Target className="w-4 h-4 mr-2" />
                  Use This Hint
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hint Generation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                {getSubjectIcon(currentSubject)}
              </div>
              <div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  I can provide hints to guide you without giving away the answer
                </p>
              </div>
            </div>
            <Button
              onClick={handleGetHint}
              disabled={isThinking}
              className="bg-gradient-to-r from-green-500 to-blue-500"
            >
              {isThinking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Hint
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {showChat && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chat with AI Tutor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32 bg-gray-50 rounded-lg p-3 overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <p className="text-sm">Hi! I'm here to help you with your studies. What would you like to know?</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything about your studies..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hint History */}
      {hintHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Hints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hintHistory.slice(-3).reverse().map((hint, index) => {
                const HintIcon = getHintTypeIcon(hint.type);
                return (
                  <div key={hint.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <HintIcon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {hint.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {hint.subject}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{hint.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Tips */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Learning Tip</h3>
              <p className="text-sm text-yellow-700">
                Don't be afraid to make mistakes! Each attempt helps me understand how to help you better. 
                Try to explain your thinking process out loud - it often helps clarify your understanding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
