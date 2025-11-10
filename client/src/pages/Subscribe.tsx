import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed to Premium!",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || !elements || isProcessing}
        data-testid="button-subscribe"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Subscribe to Premium"
        )}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!stripePromise) {
      setError("Stripe is not configured. Please contact support.");
      return;
    }

    apiRequest("POST", "/api/create-subscription")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create subscription");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to initialize subscription. Please try again.",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Unable to load subscription form</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/dashboard'} data-testid="button-back">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Subscription Not Available</CardTitle>
            <CardDescription>Payment processing is not configured</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Stripe payment processing is not configured. Please contact support to enable premium features.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'} data-testid="button-back">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="text-subscribe-title">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Upgrade to Premium
          </CardTitle>
          <CardDescription data-testid="text-subscribe-description">
            Get unlimited saves and access to all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h3 className="font-semibold mb-2">Premium Features:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Unlimited saves
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                All integrations (Notion, Google Sheets, PDF)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Priority support
              </li>
            </ul>
            <p className="mt-4 text-lg font-bold">$9.99/month</p>
          </div>
          
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SubscribeForm />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
