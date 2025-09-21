import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Globe, 
  Check, 
  ChevronDown,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES, Language, useLanguage } from '@/lib/i18n';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showLabel?: boolean;
}

export function LanguageSelector({ 
  className, 
  variant = 'default',
  showLabel = true 
}: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0", className)}>
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('settings.language')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{lang.name}</div>
                </div>
              </div>
              {lang.code === currentLanguage && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={cn("h-8", className)}>
            <Globe className="h-4 w-4 mr-2" />
            {currentLangConfig?.flag}
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('settings.language')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.nativeName}</span>
              </div>
              {lang.code === currentLanguage && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">{t('settings.language')}</span>
        </div>
      )}
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{currentLangConfig?.flag}</span>
              <div className="text-left">
                <div className="font-medium">{currentLangConfig?.nativeName}</div>
                <div className="text-xs text-muted-foreground">{currentLangConfig?.name}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>{t('settings.language')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{lang.name}</div>
                </div>
              </div>
              {lang.code === currentLanguage && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Language toggle component for quick switching
export function LanguageToggle({ className }: { className?: string }) {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    const currentIndex = SUPPORTED_LANGUAGES.findIndex(lang => lang.code === currentLanguage);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    changeLanguage(SUPPORTED_LANGUAGES[nextIndex].code);
  };

  const currentLangConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn("h-8 w-8 p-0", className)}
      title={`Switch to ${SUPPORTED_LANGUAGES[(SUPPORTED_LANGUAGES.findIndex(lang => lang.code === currentLanguage) + 1) % SUPPORTED_LANGUAGES.length].nativeName}`}
    >
      <span className="text-lg">{currentLangConfig?.flag}</span>
    </Button>
  );
}

// Language indicator component
export function LanguageIndicator({ className }: { className?: string }) {
  const { currentLanguage } = useLanguage();
  const currentLangConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="text-lg">{currentLangConfig?.flag}</span>
      <span className="text-sm font-medium">{currentLangConfig?.nativeName}</span>
    </div>
  );
}

// Language list component for settings
export function LanguageList({ 
  className,
  onLanguageSelect 
}: { 
  className?: string;
  onLanguageSelect?: (language: Language) => void;
}) {
  const { currentLanguage } = useLanguage();

  return (
    <div className={cn("space-y-2", className)}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <div
          key={lang.code}
          onClick={() => onLanguageSelect?.(lang.code)}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
            lang.code === currentLanguage 
              ? "bg-blue-50 border-blue-200" 
              : "hover:bg-gray-50"
          )}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{lang.flag}</span>
            <div>
              <div className="font-medium">{lang.nativeName}</div>
              <div className="text-xs text-muted-foreground">{lang.name}</div>
            </div>
          </div>
          {lang.code === currentLanguage && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {lang.code === 'en' ? 'Default' : 'Selected'}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

