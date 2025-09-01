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
import { OtpInput } from "@/components/ui/otp-input";
import { GraduationCap } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { toast } = useToast();
  const { setUser } = useAuth();

  const sendOtpMutation = useMutation({
    mutationFn: async (data: { mobileNumber: string }) => {
      const response = await apiRequest("POST", "/api/auth/send-otp", data);
      return response.json();
    },
    onSuccess: (data) => {
      setShowOtpForm(true);
      toast({
        title: "OTP Sent",
        description: `OTP sent to ${mobileNumber}. For demo: ${data.otp}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { mobileNumber: string; otp: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.userExists) {
        setUser(data.user);
        setLocation("/dashboard");
      } else {
        setLocation("/profile-setup");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      sendOtpMutation.mutate({ mobileNumber });
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      verifyOtpMutation.mutate({ mobileNumber, otp });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="gradient-bg text-white py-12 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <GraduationCap className="text-3xl text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Arise Learning</h1>
          <p className="text-lg opacity-90">Your journey to knowledge starts here</p>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {!showOtpForm ? (
            <Card className="bg-card rounded-2xl shadow-lg border border-border mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Enter Your Mobile Number</h2>
                
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium mb-2">Mobile Number</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">+91</span>
                      <Input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="pl-12"
                        maxLength={10}
                        data-testid="input-mobile-number"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={sendOtpMutation.isPending || mobileNumber.length !== 10}
                    data-testid="button-send-otp"
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card rounded-2xl shadow-lg border border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
                
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex justify-center">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      data-testid="input-otp"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    Didn't receive OTP?{" "}
                    <button 
                      type="button"
                      className="text-primary font-medium"
                      onClick={() => sendOtpMutation.mutate({ mobileNumber })}
                      data-testid="button-resend-otp"
                    >
                      Resend
                    </button>
                  </p>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={verifyOtpMutation.isPending || otp.length !== 4}
                    data-testid="button-verify-otp"
                  >
                    {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
