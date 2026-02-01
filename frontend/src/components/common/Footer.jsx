// src/components/common/Footer.jsx - Mobile Responsive with Tailwind
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-16 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-accent text-xl font-bold mb-4">☕ Café Delight</h3>
            <p className="text-gray-300 leading-relaxed">
              Your favorite café for delicious food and beverages. Fresh, fast, and delivered with love!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-secondary text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-accent transition hover:pl-1">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition hover:pl-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition hover:pl-1">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-300 hover:text-accent transition hover:pl-1">
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-secondary text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 +91 98765 43210</p>
              <p>📧 info@cafedelight.com</p>
              <p>📍 Jaipur, Rajasthan, India</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-secondary text-lg font-semibold mb-4">Opening Hours</h4>
            <div className="space-y-2 text-gray-300">
              <p>Monday - Friday</p>
              <p className="font-semibold">8 AM - 10 PM</p>
              <p className="mt-2">Saturday - Sunday</p>
              <p className="font-semibold">9 AM - 11 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-600 pt-6 text-center text-gray-400">
          <p>&copy; 2024 Café Delight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;