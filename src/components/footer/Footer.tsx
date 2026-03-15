import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight">InsightMatrix</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The premier platform for high-quality survey research and data collection, connecting participants with researchers globally.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white transition"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-white transition"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-white transition"><Linkedin size={20} /></Link>
              <Link href="#" className="hover:text-white transition"><Instagram size={20} /></Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li><Link href="/services/survey-participation" className="hover:text-white transition">Survey Participation</Link></li>
              <li><Link href="/services/market-research" className="hover:text-white transition">Market Research Data</Link></li>
              <li><Link href="/services/survey-panel" className="hover:text-white transition">Panel Management</Link></li>
              <li><Link href="/services/distribution-network" className="hover:text-white transition">Distribution Network</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="text-gray-500 text-xs">Email</span>
                <a href="mailto:hello@insightmatrix.com" className="hover:text-white transition">hello@insightmatrix.com</a>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-500 text-xs">Phone</span>
                <a href="tel:+18005550199" className="hover:text-white transition">+1 (800) 555-0199</a>
              </li>
              <li className="flex flex-col mt-4">
                <span className="text-gray-500 text-xs">Office</span>
                <span>123 Data Point Ave,<br />San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} InsightMatrix. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
