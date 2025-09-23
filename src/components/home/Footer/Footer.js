import React from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-700">
      <div className="footer flex flex-col lg:flex-row px-4 lg:px-10 py-10 gap-10">
        
        {/* Contact Section */}
        <div className="part1 w-full lg:w-[25%] border-r border-gray-200 pr-6">
          <h2 className="text-lg font-semibold mb-4">Contact us</h2>
          <p className="text-sm mb-4">
            Classyshop - Mega Super Store <br />
            507-Union Trade Centre France
          </p>
          <a href="mailto:sales@yourcompany.com" className="text-sm block mb-2 hover:text-primary">
            sales@yourcompany.com
          </a>
          <span className="text-xl font-bold block text-primary mb-5">
            (+91) 9876-543-210
          </span>
          <div className="flex items-center gap-2">
            <MessageCircle className="text-primeColor w-8 h-8" />
            <span className="text-sm font-semibold">
              Online Chat <br /> Get Expert Help
            </span>
          </div>
        </div>

        {/* Links Section */}
        <div className="part2 w-full lg:w-[40%] flex gap-10 pl-0 lg:pl-8">
          <div className="part2_col1 w-1/2">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary">Prices drop</a></li>
              <li><a href="/" className="hover:text-primary">New products</a></li>
              <li><a href="/" className="hover:text-primary">Best sales</a></li>
              <li><a href="/" className="hover:text-primary">Contact us</a></li>
              <li><a href="/" className="hover:text-primary">Sitemap</a></li>
              <li><a href="/" className="hover:text-primary">Stores</a></li>
            </ul>
          </div>
          <div className="part2_col2 w-1/2">
            <h2 className="text-lg font-semibold mb-4">Our Company</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary">Delivery</a></li>
              <li><a href="/" className="hover:text-primary">Legal Notice</a></li>
              <li><a href="/" className="hover:text-primary">Terms & Conditions</a></li>
              <li><a href="/" className="hover:text-primary">About us</a></li>
              <li><a href="/" className="hover:text-primary">Secure Payment</a></li>
              <li><a href="/" className="hover:text-primary">Login</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="part3 w-full lg:w-[35%] pl-0 lg:pl-8 pr-0 lg:pr-8">
          <h2 className="text-lg font-semibold mb-2">Subscribe to Newsletter</h2>
          <p className="text-sm text-gray-600">
            Subscribe to our latest newsletter to get news about special discounts.
          </p>

          <form className="mt-5">
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full h-[45px] border border-gray-300 rounded-full px-4 mb-3 focus:border-gray-500 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-primareColor text-white py-3 rounded-sm font-medium hover:bg-primary/90 transition"
            >
              SUBSCRIBE
            </button>
            <label className="flex items-start gap-2 mt-4 text-xs text-gray-600 ">
              <input type="checkbox" className="mt-1 bg-primeColor" />
              I agree to the terms and conditions and the privacy policy
            </label>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Classyshop. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
