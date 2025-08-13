import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import stytchService from "../../services/stytch";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!email) {
            setMessage("Please enter your email address");
            return;
        }

        setIsLoading(true);
        try {
            await stytchService.registerUser(email, "student");
            setMessage("Registration successful! You can now sign in with your email.");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleRegister();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Join Gallaugher's Quizzes
                        </CardTitle>
                        <CardDescription className="text-center">
                            Join the quiz platform and start learning
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Create account"}
                            </Button>
                        </form>
                        {message && (
                            <div className={`mt-4 p-3 rounded-md text-sm ${
                                message.includes("successful") 
                                    ? "bg-green-50 text-green-700 border border-green-200" 
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                                {message}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <div className="text-center w-full">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link 
                                    to="/login" 
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Register;
