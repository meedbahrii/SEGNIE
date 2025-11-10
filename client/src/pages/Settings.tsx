import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Crown, User, Lock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface User {
  id: string;
  username: string;
  isPremium: boolean;
  saveCount: number;
}

interface UserResponse {
  user: User;
}

interface SaveLimit {
  saveCount: number;
  limit: number;
  remaining: number;
  isPremium: boolean;
  canSave: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { data: userResponse, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ["/api/auth/me"],
  });

  const user = userResponse?.user;

  const { data: saveLimit } = useQuery<SaveLimit>({
    queryKey: ["/api/user/save-limit"],
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      return await apiRequest("POST", "/api/auth/change-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      passwordForm.reset();
      setIsChangingPassword(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Password change failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-settings-title">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and subscription
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <div className="mt-1">
                  <Input 
                    value={user.username} 
                    disabled 
                    data-testid="input-username"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Account Type</label>
                <div className="mt-2" data-testid="text-account-type">
                  {user.isPremium ? (
                    <Badge variant="default" className="gap-1">
                      <Crown className="h-3 w-3" />
                      Premium
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <CardTitle>Password</CardTitle>
              </div>
              <CardDescription>Change your account password</CardDescription>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <Button 
                  onClick={() => setIsChangingPassword(true)}
                  variant="outline"
                  data-testid="button-change-password"
                >
                  Change Password
                </Button>
              ) : (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter current password"
                              data-testid="input-current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter new password"
                              data-testid="input-new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Confirm new password"
                              data-testid="input-confirm-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        data-testid="button-submit-password"
                      >
                        {changePasswordMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update Password
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          passwordForm.reset();
                        }}
                        data-testid="button-cancel-password"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>Subscription & Usage</CardTitle>
              </div>
              <CardDescription>Your plan and save limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {saveLimit && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Saves Used</span>
                      <span className="text-sm text-muted-foreground" data-testid="text-save-count">
                        {user.isPremium ? (
                          <>{saveLimit.saveCount} (Unlimited)</>
                        ) : (
                          <>{saveLimit.saveCount} / {saveLimit.limit}</>
                        )}
                      </span>
                    </div>
                    {!user.isPremium && (
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(saveLimit.saveCount / saveLimit.limit) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {!user.isPremium && (
                    <>
                      <Separator />
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <div className="flex items-start gap-2">
                          <Crown className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium">Upgrade to Premium</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Get unlimited saves and access all premium features
                            </p>
                            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                              <li>• Unlimited saves</li>
                              <li>• All integrations</li>
                              <li>• Priority support</li>
                              <li>• Advanced features</li>
                            </ul>
                          </div>
                        </div>
                        <Button
                          onClick={() => setLocation("/subscribe")}
                          className="w-full"
                          data-testid="button-upgrade"
                        >
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade Now - $9.99/month
                        </Button>
                      </div>
                    </>
                  )}

                  {user.isPremium && (
                    <>
                      <Separator />
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-primary">
                          <Crown className="h-5 w-5" />
                          <span className="font-medium">You're on Premium</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Thank you for your support! You have access to all features and unlimited saves.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
