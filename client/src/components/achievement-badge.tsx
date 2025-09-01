import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  icon: string;
  color: string;
  name: string;
  size?: "default" | "small";
  className?: string;
}

export function AchievementBadge({ 
  icon, 
  color, 
  name, 
  size = "default", 
  className 
}: AchievementBadgeProps) {
  const sizeClasses = size === "small" 
    ? "w-16 h-16" 
    : "w-20 h-20";

  const getColorClasses = (color: string) => {
    switch (color) {
      case "secondary":
        return "bg-secondary";
      case "accent":
        return "bg-accent";
      case "primary":
        return "bg-primary";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="flex-shrink-0 text-center">
      <div className={cn(
        "achievement-badge text-white flex-shrink-0 mx-auto",
        sizeClasses,
        getColorClasses(color),
        className
      )}>
        <i className={`${icon} text-2xl`}></i>
      </div>
      {name && size !== "small" && (
        <p className="text-xs font-medium mt-2">{name}</p>
      )}
    </div>
  );
}
