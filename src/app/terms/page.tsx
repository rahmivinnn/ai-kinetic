import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="lead">
            Welcome to Kinetic AI. By using our services, you agree to these terms. Please read them carefully.
          </p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Kinetic AI's services, website, or applications (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Services.
          </p>
          
          <h2>2. Description of Services</h2>
          <p>
            Kinetic AI provides AI-powered pose detection and analysis services that help users analyze body posture and movement. Our Services may include video upload, real-time analysis, feedback generation, and other related features.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Services, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information as necessary.
          </p>
          
          <h2>4. User Content</h2>
          <p>
            You retain ownership of any content you upload to the Services, including videos, images, and other materials ("User Content"). By uploading User Content, you grant Kinetic AI a non-exclusive, worldwide, royalty-free license to use, store, display, reproduce, modify, and distribute your User Content solely for the purpose of providing and improving the Services.
          </p>
          
          <h2>5. Privacy</h2>
          <p>
            Your privacy is important to us. Our <Link href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using the Services, you agree to our Privacy Policy.
          </p>
          
          <h2>6. Prohibited Conduct</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the Services for any illegal purpose or in violation of any laws</li>
            <li>Upload or share content that infringes on the rights of others</li>
            <li>Attempt to gain unauthorized access to the Services or other users' accounts</li>
            <li>Use the Services to harass, abuse, or harm others</li>
            <li>Interfere with or disrupt the Services or servers connected to the Services</li>
            <li>Use automated means to access or collect data from the Services without our permission</li>
          </ul>
          
          <h2>7. Termination</h2>
          <p>
            We may suspend or terminate your access to the Services at any time for any reason, including if you violate these Terms. You may also terminate your account at any time by following the instructions on our website.
          </p>
          
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          
          <h2>9. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, KINETIC AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
          
          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. If we make significant changes, we will notify you through the Services or by other means. Your continued use of the Services after the changes take effect constitutes your acceptance of the revised Terms.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@kineticai.com.
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Last updated: July 20, 2023
          </p>
        </div>
      </div>
    </div>
  );
}
