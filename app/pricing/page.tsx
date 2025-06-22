"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Feature {
  text: string;
  isAvailable: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: Feature[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined;
  buttonClass?: string;
  isPopular?: boolean;
  isDisabled?: boolean;
  type: "personal" | "business";
}

const allPlans: Plan[] = [
  {
    name: "Free",
    price: "0",
    period: "USD/month",
    description: "Explore how AI can help you with everyday tasks",
    features: [
      { text: "Access to GPT-4o mini and reasoning", isAvailable: true },
      { text: "Standard voice mode", isAvailable: true },
      { text: "Real-time data from the web with search", isAvailable: true },
      { text: "Limited access to GPT-4o and o4-mini", isAvailable: true },
      { text: "Limited access to file uploads, advanced data analysis, and image generation", isAvailable: true },
      { text: "Use custom GPTs", isAvailable: true },
    ],
    buttonText: "Your current plan",
    buttonVariant: "default",
    buttonClass: "bg-gray-600 text-white hover:bg-gray-700",
    isDisabled: true,
    type: "personal",
  },
  {
    name: "Plus",
    price: "20",
    period: "USD/month",
    description: "Level up productivity and creativity with expanded access",
    features: [
      { text: "Everything in Free", isAvailable: true },
      {
        text: "Extended limits on messaging, file uploads, advanced data analysis, and image generation",
        isAvailable: true,
      },
      { text: "Standard and advanced voice mode", isAvailable: true },
      {
        text: "Access to deep research, multiple reasoning models (o4-mini, o4-mini-high, and o3), and a research preview of GPT-4.5",
        isAvailable: true,
      },
      { text: "Create and use tasks, projects, and custom GPTs", isAvailable: true },
      { text: "Limited access to Sora video generation", isAvailable: true },
      { text: "Opportunities to test new features", isAvailable: true },
    ],
    buttonText: "Get Plus",
    buttonVariant: "default",
    buttonClass: "bg-green-600 text-white hover:bg-green-700",
    isPopular: true,
    type: "personal",
  },
  {
    name: "Pro",
    price: "200",
    period: "USD/month",
    description: "Get the best of OpenAI with the highest level of access",
    features: [
      { text: "Everything in Plus", isAvailable: true },
      { text: "Unlimited access to all reasoning models and GPT-4o", isAvailable: true },
      { text: "Unlimited access to advanced voice", isAvailable: true },
      {
        text: "Extended access to deep research, which conducts multi-step online research for complex tasks",
        isAvailable: true,
      },
      { text: "Access to research previews of GPT-4.5 and Operator", isAvailable: true },
      {
        text: "Access to o1 pro mode, which uses more compute for the best answers to the hardest questions",
        isAvailable: true,
      },
      { text: "Extended access to Sora video generation", isAvailable: true },
      { text: "Access to a research preview of Codex agent", isAvailable: true },
    ],
    buttonText: "Get Pro",
    buttonVariant: "outline",
    buttonClass: "bg-black text-white hover:bg-gray-900",
    type: "personal",
  },
  {
    name: "Team",
    price: "50",
    period: "USD/month",
    description: "Collaborate with your team on AI-powered tasks",
    features: [
      { text: "All Pro features", isAvailable: true },
      { text: "Shared workspaces", isAvailable: true },
      { text: "Admin controls", isAvailable: true },
      { text: "Priority support", isAvailable: true },
      { text: "Dedicated support channel", isAvailable: true },
      { text: "Customizable roles and permissions", isAvailable: true },
    ],
    buttonText: "Get Team",
    buttonVariant: "default",
    buttonClass: "bg-blue-600 text-white hover:bg-blue-700",
    isPopular: true,
    type: "business",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations",
    features: [
      { text: "Dedicated account manager", isAvailable: true },
      { text: "Custom integrations", isAvailable: true },
      { text: "On-premise deployment options", isAvailable: true },
      { text: "Advanced security features", isAvailable: true },
      { text: "SLA and uptime guarantees", isAvailable: true },
      { text: "Single Sign-On (SSO)", isAvailable: true },
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    buttonClass: "bg-black text-white hover:bg-gray-900",
    type: "business",
  },
];

export default function PricingPage() {
  const [planType, setPlanType] = React.useState("personal");
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white px-4 sm:px-6 py-8 relative">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-black dark:text-white hover:text-gray-400"
        onClick={() => router.back()}
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Go back</span>
      </Button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-3xl font-bold text-center mb-6">
          Upgrade your plan
        </h1>

        <div className="flex justify-center mb-8">
          <ToggleGroup
            type="single"
            value={planType}
            onValueChange={(value) => {
              if (value) setPlanType(value);
            }}
            className="bg-neutral-200 dark:bg-[#262626] rounded-lg p-1"
          >
            <ToggleGroupItem
              value="personal"
              className="px-4 sm:px-6 py-2 rounded-md data-[state=on]:bg-[#3F3F3F] data-[state=on]:text-white text-gray-700 dark:text-gray-400 hover:bg-[#3F3F3F]/80"
            >
              Personal
            </ToggleGroupItem>
            <ToggleGroupItem
              value="business"
              className="px-4 sm:px-6 py-2 rounded-md data-[state=on]:bg-[#3F3F3F] data-[state=on]:text-white text-gray-700 dark:text-gray-400 hover:bg-[#3F3F3F]/80"
            >
              Business
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPlans
            .filter((plan) => plan.type === planType)
            .map((plan) => (
              <Card
                key={plan.name}
                className={`bg-white dark:bg-[#262626] text-black dark:text-white border ${
                  plan.isPopular ? "border-green-600" : "border-gray-200 dark:border-[#3F3F3F]"
                } rounded-xl flex flex-col`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl sm:text-2xl font-semibold">{plan.name}</CardTitle>
                    {plan.isPopular && (
                      <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mt-2">
                    ${plan.price}
                    <span className="text-base font-normal text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                  <Button
                    className={`w-full py-2 rounded-lg text-lg font-medium ${plan.buttonClass}`}
                    variant={plan.buttonVariant}
                    disabled={plan.isDisabled}
                  >
                    {plan.buttonText}
                  </Button>
                  <ul className="mt-6 space-y-3 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {plan.name === "Plus" && (
                  <CardFooter className="pt-4">
                    <a href="#" className="text-sm text-gray-400 hover:underline">
                      Limits apply
                    </a>
                  </CardFooter>
                )}
                {plan.name === "Pro" && (
                  <CardFooter className="pt-4">
                    <p className="text-sm text-gray-400">
                      Unlimited subject to abuse guardrails.{" "}
                      <a href="#" className="text-green-500 hover:underline">
                        Learn more
                      </a>
                    </p>
                  </CardFooter>
                )}
              </Card>
            ))}
        </div>

        <div className="text-center text-sm text-gray-400 dark:text-gray-500 mt-10">
          Have an existing plan?{" "}
          <a href="#" className="text-green-500 hover:underline">
            See billing help
          </a>
        </div>
        <div className="flex justify-center mt-4">
          <span className="text-gray-500 text-2xl">•••</span>
        </div>
      </div>
    </main>
  );
}
