import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="lead">
            At Kinetic AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect the following types of information:
          </p>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
            <li><strong>Profile Information:</strong> You may choose to provide additional information such as your photo, occupation, and physical characteristics.</li>
            <li><strong>Content:</strong> We collect videos, images, and other content you upload to our Services.</li>
            <li><strong>Usage Information:</strong> We collect information about how you use our Services, including your interactions with features and content.</li>
            <li><strong>Device Information:</strong> We collect information about the devices you use to access our Services, including device type, operating system, and browser type.</li>
            <li><strong>Location Information:</strong> With your permission, we may collect information about your location.</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information for the following purposes:
          </p>
          <ul>
            <li>To provide and improve our Services</li>
            <li>To personalize your experience</li>
            <li>To communicate with you about our Services</li>
            <li>To analyze and improve our Services</li>
            <li>To detect and prevent fraud and abuse</li>
            <li>To comply with legal obligations</li>
          </ul>
          
          <h2>3. How We Share Your Information</h2>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> We share information with third-party service providers who help us operate our Services.</li>
            <li><strong>Business Partners:</strong> We may share information with our business partners to offer joint content or services.</li>
            <li><strong>Legal Authorities:</strong> We may share information if required by law or to protect our rights or the rights of others.</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>
          
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>
          
          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to delete your information</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us at privacy@kineticai.com.
          </p>
          
          <h2>6. Children's Privacy</h2>
          <p>
            Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
          </p>
          
          <h2>7. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the country in which you reside. These countries may have different data protection laws than your country. We take steps to ensure that your information receives an adequate level of protection in the countries in which we process it.
          </p>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through the Services or by other means. Your continued use of the Services after the changes take effect constitutes your acceptance of the revised Privacy Policy.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@kineticai.com.
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Last updated: July 20, 2023
          </p>
        </div>
      </div>
    </div>
  );
}
