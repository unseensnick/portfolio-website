"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

interface ResetPasswordFormProps {
    token: string | null;
}

function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (!token) {
            setMessage("Invalid or missing reset token");
            return;
        }

        setIsLoading(true);
        setMessage("");
        setErrors({});

        try {
            const baseUrl =
                process.env.NEXT_PUBLIC_PAYLOAD_URL || window.location.origin;
            const response = await fetch(
                `${baseUrl}/api/users/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setMessage(
                    "Password reset successfully! Redirecting to login..."
                );

                // Redirect to admin login after 3 seconds
                setTimeout(() => {
                    router.push("/admin/login");
                }, 3000);
            } else {
                setMessage(
                    data.message ||
                        "Failed to reset password. The link may have expired."
                );
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                    Invalid Reset Link
                </h1>
                <p className="text-muted-foreground">
                    This password reset link is invalid or has expired. Please
                    request a new password reset.
                </p>
                <Button
                    onClick={() => router.push("/admin/login")}
                    variant="default"
                >
                    Back to Login
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                    Password Reset Successful!
                </h1>
                <p className="text-muted-foreground">
                    Your password has been successfully reset. You will be
                    redirected to the login page shortly.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                    Reset Your Password
                </h1>
                <p className="text-muted-foreground">
                    Enter your new password below
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your new password"
                            className={cn(
                                "pr-10",
                                errors.password &&
                                    "border-destructive focus:border-destructive"
                            )}
                            disabled={isLoading}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-destructive">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                        Confirm New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            className={cn(
                                "pr-10",
                                errors.confirmPassword &&
                                    "border-destructive focus:border-destructive"
                            )}
                            disabled={isLoading}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={isLoading}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>

                {/* Message Display */}
                {message && (
                    <div
                        className={cn(
                            "p-3 rounded-md text-sm",
                            isSuccess
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                        )}
                    >
                        {message}
                    </div>
                )}
            </form>

            {/* Back to Login Link */}
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/admin/login")}
                    disabled={isLoading}
                >
                    Back to Login
                </Button>
            </div>
        </div>
    );
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
    return (
        <Card className="w-full max-w-md p-6 space-y-6 shadow-xl border-border/50">
            <Suspense
                fallback={
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading...</p>
                    </div>
                }
            >
                <ResetPasswordContent />
            </Suspense>
        </Card>
    );
}
