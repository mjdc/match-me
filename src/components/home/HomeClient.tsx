"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicHeartAnimation = dynamic(() => import("@/components/animations/HeartAnimation"), { ssr: false });
const DynamicAnimatedBackground = dynamic(() => import("@/components/animations/AnimatedBackground"), { ssr: false });
const DynamicAnimatedStats = dynamic(() => import("@/components/animations/AnimatedStats"), { ssr: false });
const DynamicAnimatedFeatures = dynamic(() => import("@/components/animations/AnimatedFeatures"), { ssr: false });

type Props = {
  session: any;
};

export default function HomeClient({ session }: Props) {
  return (
    <div className="-mx-[calc(50vw-50%)] w-screen -mt-[calc(1.25rem)]">
      {/* Hero Section */}
      <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-pink-100 via-pink-50 to-white">
        <DynamicAnimatedBackground />
        <DynamicHeartAnimation />

        <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col justify-center items-center min-h-screen">
          <div className="text-center space-y-8 w-full max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text transform hover:scale-105 transition-transform cursor-default">
                Find Your Perfect Match
              </span>
            </h1>

            <div className="flex flex-col items-center gap-8 mt-12">
              {session ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl px-12 py-8 rounded-full hover:opacity-90 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                >
                  <Link href="/members">Continue to Matches</Link>
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl px-12 py-8 rounded-full hover:opacity-90 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                  >
                    <Link href="/register">Start Meeting Singles</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-white text-pink-500 border-2 border-pink-500 text-xl px-12 py-8 rounded-full hover:bg-pink-50 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              )}
            </div>

            <DynamicAnimatedStats />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full min-h-screen bg-white relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col justify-center items-center min-h-screen">
          <div className="text-center w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text w-full">
              Why Choose MatchMe?
            </h2>
            <DynamicAnimatedFeatures />
          </div>
        </div>
      </div>
    </div>
  );
}
