import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";

export default function ProfileSetupPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    language: "english",
    mobileNumber: "", // Will be set from localStorage or context
  });
  const { toast } = useToast();
  const { setUser } = useAuth();

  const completeProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/auth/complete-profile", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast({
        title: "Profile Complete",
        description: "Welcome to Arise Learning!",
      });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.class) {
      // Get mobile number from localStorage (set during OTP verification)
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      completeProfileMutation.mutate({ ...formData, mobileNumber });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="opacity-90 mt-1">Tell us about yourself</p>
        </div>
      </div>

      {/* Profile Setup Form */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-card rounded-2xl shadow-lg border border-border">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium mb-2">Your Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">Class</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                    <SelectTrigger data-testid="select-class">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class-1">Class 1</SelectItem>
                      <SelectItem value="class-2">Class 2</SelectItem>
                      <SelectItem value="class-3">Class 3</SelectItem>
                      <SelectItem value="class-4">Class 4</SelectItem>
                      <SelectItem value="class-5">Class 5</SelectItem>
                      <SelectItem value="class-6">Class 6</SelectItem>
                      <SelectItem value="class-7">Class 7</SelectItem>
                      <SelectItem value="class-8">Class 8</SelectItem>
                      <SelectItem value="class-9">Class 9</SelectItem>
                      <SelectItem value="class-10">Class 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">Preferred Language</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={formData.language === "english" ? "default" : "outline"}
                      className="p-3 h-auto flex flex-col"
                      onClick={() => setFormData(prev => ({ ...prev, language: "english" }))}
                      data-testid="button-language-english"
                    >
                      <Languages className="text-lg mb-1" />
                      <div className="text-sm font-medium">English</div>
                    </Button>
                    <Button
                      type="button"
                      variant={formData.language === "hindi" ? "default" : "outline"}
                      className="p-3 h-auto flex flex-col"
                      onClick={() => setFormData(prev => ({ ...prev, language: "hindi" }))}
                      data-testid="button-language-hindi"
                    >
                      <Languages className="text-lg mb-1" />
                      <div className="text-sm font-medium">हिंदी</div>
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={completeProfileMutation.isPending || !formData.name || !formData.class}
                  data-testid="button-start-learning"
                >
                  {completeProfileMutation.isPending ? "Setting up..." : "Start Learning"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
