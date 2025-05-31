"use client"

import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Capabilities } from "@/components/landing/capabilities"
import { Demo } from "@/components/landing/demo"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { Navigation } from "@/components/landing/navigation"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { checkAndStoreUser } from "./actions/auth"

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (isLoaded && user) {
        try {
          const result = await checkAndStoreUser({
            id: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            imageUrl: user.imageUrl,
          });
          if (!result.success) {
            setError(result.message);
          }
        } catch (err) {
          console.error("Error in checkUser:", err);
          setError("Failed to process user data");
        }
      }
    };
    
    checkUser();
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative z-50" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <Hero />
      <Features />
      <HowItWorks />
      <Capabilities />
      <Demo />
      <CTA />
      <Footer />
    </div>
  )
}
