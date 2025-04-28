"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Activity,
  Brain,
  Shield,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  LineChart,
  Users,
  BarChart3,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Movement Intelligence",
      description:
        "Computer vision technology that analyzes each movement to ensure therapeutic effectiveness",
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Responsive Therapy Plans",
      description:
        "Dynamic rehabilitation protocols that evolve based on your performance and recovery indicators",
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Recovery Analytics",
      description:
        "Visual progress reports with actionable insights to keep your recovery on track",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Clinical-Grade Privacy",
      description:
        "Enterprise-level security ensuring your medical information meets healthcare compliance standards",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Initial Assessment",
      description:
        "Complete a comprehensive evaluation of your condition and goals",
    },
    {
      number: "2",
      title: "Personalized Plan",
      description:
        "Receive a customized therapy program tailored to your needs",
    },
    {
      number: "3",
      title: "Track Progress",
      description:
        "Monitor your improvements with detailed analytics and feedback",
    },
  ];

  const practitionerFeatures = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Clinical Integration",
      description:
        "Seamlessly integrate AI-powered movement analysis into your existing workflow",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Patient Monitoring",
      description:
        "Track patient progress and adherence with detailed analytics and reporting",
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Practice Growth",
      description:
        "Expand your practice with remote monitoring and data-driven treatment plans",
    },
  ];

  return (
    <div className="min-h-screen bg-background ">
      <Navbar />
      {/* Hero Section */}
      <section className="w-[90%] flex flex-col lg:flex-row items-center justify-between min-h-[60svh] mx-auto gap-5 mt-20">
        <div className="flex flex-col w-full space-y-4 lg:space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold leading-[40px] lg:leading-[70px]">
            Personalized Recovery <br /> Powered By Movement <br /> Intelligence
          </h1>
          <p className="text-sm lg:text-lg text-[#4B5563]">
            Transform your rehabilitation with intelligent movement coaching and
            data-driven therapy. Our platform bridges home exercises with
            clinical expertise for a smoother, faster recovery experience.
          </p>
          <div className="">
            <Link href={"/dashboard"}>
              <Button className="mr-4">Start Your Journey</Button>
            </Link>
            <Button variant="outline">Watch Demo</Button>
          </div>
        </div>

        <div className="w-full">
          <img
            src="https://s3-alpha-sig.figma.com/img/dc6e/204e/90340380d9bc8a0746ad75115012914d?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NToPMx8Vjmz51qjJFEDB26OQVzyWChO5tBnSwSJ4C6FhFYeIYwJC3d365uhG-IsDcMFIZMlt~B0kNJSSwofsv4VDg~9rBK~NHusBJQBADxAdnfi~jtVHiJ3pxcYcrxXaPhASUV9RDqc4XqRVIovvCeUJ7tGeOlix82C8bSWIu-hpsH54zPX0reE67jui3Vk0HjS6iVGgUfNLEFfpqToZZL8GJiZOT54de24d68jLhNnwbtCUDKdM~wupJPoTeT4HjThoTIQ5Izr5eOwAKCcFDz2BZjJ8KjebjtKVmZ1gJVm-UXv5l04SW2xguUl0NcRpH29afa5FymAm6NEQ6y1Amw__"
            alt=""
            className="object-contain w-full rounded-2xl"
          />
        </div>
      </section>

      <div className="w-[90%] mx-auto mt-10">
        <img
          src="https://s3-alpha-sig.figma.com/img/d183/1141/c23a8608249385da8b3b116ef8333409?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qLTmfgBu~aTI5IUNTkc4Lngw7oyjiJjc0kT0D3wUGry30QReGmTNgdvkY0dCE-IsuBDKnRS21fIo1ikcWxFMnrvoxX8L7LHfox~vplXrOelt-wogozKtH42wRAJT73ULPZCalD07kSDKwe3v0j5f4IUqXCmKI2ycKEBYB6ja-JeATcAspISWzOSpN81~KYUKXhbotTNxG2~DE8M333GNTqCVYNoIRQ18tqkockAeFYfNbsOo~o8m1PRragdnybkG3qxi92Pnc4ehoV88WJn47l1C6t4H6yuRatMb3MNsog7xhA2xyfYUrmPsa6G4ZUe2SlTKXGFPhra9Zi1bgIj4Fg__"
          alt=""
          className="h-[100px] lg:h-[300px] w-full object-fill rounded-2xl"
        />
      </div>

      <section className="py-16 px-4 md:px-6 lg:px-8 w-full mx-auto space-y-5">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Smart Rehabilitation Ecosystem
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Comprehensive tools designed by rehabilitation specialists and AI
            engineers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="p-24 w-full bg-[#F9FAFB]">
          <h2 className="text-3xl font-bold text-center mb-12">How it Works</h2>
          <p className="text-center text-muted-foreground mb-12">
            Three simple steps to start your recovery journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For Practitioners Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            For Practitioners
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Enhance your practice with AI-powered rehabilitation tools
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {practitionerFeatures.map((feature, index) => (
              <Card
                key={index}
                className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Success Stories</h2>
            <p className="mt-4 text-muted-foreground">
              Hear from patients who transformed their recovery journey
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        i === 1
                          ? "1494790108377-be9c29b29330"
                          : i === 2
                          ? "1539571696357-5a69c17a67c6"
                          : "1534528741775-53994a69daeb"
                      }?w=100&h=100&fit=crop`}
                      alt={`Patient ${i}`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">
                        Knee Rehabilitation
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &quot;The AI-guided exercises and professional support
                    helped me recover faster than I expected. I&apos;m back to
                    my active lifestyle!&quot;
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to Start Your Recovery Journey?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of patients who have successfully recovered using our
            platform
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                Begin Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent text-white"
            >
              <Link href="/">
                Schedule Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-muted-foreground  bg-[#111827] text-white">
        <div className="mx-auto max-w-[90%] px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 text-white">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Kinetic AI</h3>
              <p className="text-[#9CA3AF]">
                © 2023 Kinetic AI. All rights reserved.
              </p>
              <div className="flex flex-row space-x-3">
                <Twitter className="text-[#9CA3AF] cursor-pointer" />
                <Facebook className="text-[#9CA3AF] cursor-pointer" />
                <Linkedin className="text-[#9CA3AF] cursor-pointer" />
                <Instagram className="text-[#9CA3AF] cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    About
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Careers
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Contact
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Blog
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Documentation
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Help Center
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Privacy
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Terms
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Security
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Twitter
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    LinkedIn
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-[#9CA3AF]">
                    Facebook
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-muted-foreground pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Exercise Therapy Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
