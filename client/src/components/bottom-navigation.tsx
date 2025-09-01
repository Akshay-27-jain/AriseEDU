import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, ClipboardPenIcon, TrendingUp, User } from "lucide-react";

interface BottomNavigationProps {
  currentPage: "home" | "lessons" | "quiz" | "progress" | "profile";
}

export function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { 
      id: "home", 
      icon: Home, 
      label: "Home", 
      path: "/dashboard" 
    },
    { 
      id: "lessons", 
      icon: BookOpen, 
      label: "Lessons", 
      path: "/dashboard" // TODO: Create lessons page
    },
    { 
      id: "quiz", 
      icon: ClipboardPenIcon, 
      label: "Quiz", 
      path: "/quiz/quiz-math-1" // TODO: Create quiz selection page
    },
    { 
      id: "progress", 
      icon: TrendingUp, 
      label: "Progress", 
      path: "/dashboard" // TODO: Create progress page
    },
    { 
      id: "profile", 
      icon: User, 
      label: "Profile", 
      path: "/profile" 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center py-2 px-4 h-auto ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setLocation(item.path)}
              data-testid={`nav-${item.id}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
