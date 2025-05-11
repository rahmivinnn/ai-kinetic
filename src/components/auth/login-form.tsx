'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, LogIn, Mail, Lock, User, ArrowRight, Github, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showDemoMessage, setShowDemoMessage] = useState(false);
  const { login } = useAuth();

  // Show demo message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDemoMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address', {
        description: 'Email is required to identify your account'
      });
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password || 'password123');
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const demoEmails = [
      'john.doe@example.com',
      'sarah.smith@example.com',
      'alex.johnson@example.com',
      'maria.garcia@example.com',
      'david.kim@example.com'
    ];

    const randomEmail = demoEmails[Math.floor(Math.random() * demoEmails.length)];
    setEmail(randomEmail);
    setPassword('demopassword');

    try {
      setIsLoading(true);
      await login(randomEmail, 'demopassword');
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {showDemoMessage && (
        <div className="bg-blue-900/50 border border-blue-400/30 rounded-lg p-4 animate-fade-in backdrop-blur-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Badge variant="outline" className="bg-blue-800/70 text-blue-100 border-blue-400/30 px-2 py-1">
                Demo Mode
              </Badge>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-100">
                Enter any email to login. No password validation is required.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="overflow-hidden border-2 border-white/20 bg-white/10 backdrop-blur-lg text-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">Welcome to Kinetic AI</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <LogIn className="h-5 w-5 text-white" />
            </div>
          </div>
          <CardDescription className="text-blue-100">
            Login to your account to continue your recovery journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-blue-100">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/20 border-white/10 text-white placeholder:text-blue-200/70"
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-blue-100">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-200 hover:text-white hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/20 border-white/10 text-white placeholder:text-blue-200/70"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-blue-300 text-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none text-blue-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-blue-300/30"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-blue-900/50 px-2 text-blue-200">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleDemoLogin} 
              disabled={isLoading}
              className="border-blue-300/30 text-blue-100 hover:bg-blue-800/50 hover:text-white"
            >
              <User className="mr-2 h-4 w-4" />
              Demo Account
            </Button>
            <Button 
              variant="outline" 
              disabled={isLoading}
              className="border-blue-300/30 text-blue-100 hover:bg-blue-800/50 hover:text-white"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center p-6 bg-blue-900/50">
          <p className="text-sm text-blue-200">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-white font-medium hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-blue-300/70 mt-2">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-200 hover:text-white hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-200 hover:text-white hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
