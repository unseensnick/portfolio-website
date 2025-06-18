"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    cn,
    createFullScreenCenteredLayout,
    createPasswordField,
    validators,
} from "@/lib/utils";
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
    const [errors, setErrors] = useState<{
        password?: string;
        confirmPassword?: string;
    }>({});
    const router = useRouter();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Validate password
        const passwordError = validators.validateField(password, [
            () => validators.required(password, "Password"),
            () => validators.minLength(password, 8, "Password"),
        ]);
        if (passwordError) newErrors.password = passwordError;

        // Validate confirm password
        const confirmPasswordError = validators.validateField(confirmPassword, [
            () =>
                validators.required(
                    confirmPassword,
                    "Please confirm your password"
                ),
            () => validators.passwordMatch(password, confirmPassword),
        ]);
        if (confirmPasswordError)
            newErrors.confirmPassword = confirmPasswordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setMessage(
                    "Password reset successfully! Redirecting to login..."
                );
                setTimeout(() => {
                    router.push("/admin");
                }, 2000);
            } else {
                setMessage(data.error || "Failed to reset password");
            }
        } catch {
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Create password field configurations using utility
    const passwordField = createPasswordField(
        password,
        setPassword,
        showPassword,
        () => setShowPassword(!showPassword),
        {
            id: "reset-password",
            placeholder: "Enter your new password",
            error: errors.password,
            disabled: isLoading,
        }
    );

    const confirmPasswordField = createPasswordField(
        confirmPassword,
        setConfirmPassword,
        showConfirmPassword,
        () => setShowConfirmPassword(!showConfirmPassword),
        {
            id: "reset-confirm-password",
            placeholder: "Confirm your new password",
            error: errors.confirmPassword,
            disabled: isLoading,
        }
    );

    if (!token) {
        return (
            <div className={createFullScreenCenteredLayout()}>
                <Card className="w-full max-w-md p-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <h1 className="text-2xl font-bold mb-2">
                        Invalid Reset Link
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Button
                        onClick={() => router.push("/admin")}
                        className="w-full"
                    >
                        Back to Login
                    </Button>
                </Card>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className={createFullScreenCenteredLayout()}>
                <Card className="w-full max-w-md p-8 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">
                        Password Reset Successful
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Your password has been reset successfully. You will be
                        redirected to the login page.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className={createFullScreenCenteredLayout()}>
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h1 className="text-2xl font-bold">Reset Your Password</h1>
                    <p className="text-muted-foreground mt-2">
                        Enter your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="reset-password">New Password</Label>
                        <div className="relative">
                            <Input {...passwordField.inputProps} />
                            <Button {...passwordField.toggleButtonProps}>
                                {passwordField.showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {passwordField.error && (
                            <p className="text-sm text-destructive">
                                {passwordField.error}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="reset-confirm-password">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input {...confirmPasswordField.inputProps} />
                            <Button {...confirmPasswordField.toggleButtonProps}>
                                {confirmPasswordField.showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {confirmPasswordField.error && (
                            <p className="text-sm text-destructive">
                                {confirmPasswordField.error}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>

                    {/* Message */}
                    {message && (
                        <div
                            className={cn(
                                "text-sm text-center p-3 rounded-lg",
                                isSuccess
                                    ? "text-green-700 bg-green-50 border border-green-200"
                                    : "text-destructive bg-destructive/10 border border-destructive/20"
                            )}
                        >
                            {message}
                        </div>
                    )}
                </form>

                <div className="mt-6 text-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin")}
                        className="text-sm"
                    >
                        Back to Login
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}
