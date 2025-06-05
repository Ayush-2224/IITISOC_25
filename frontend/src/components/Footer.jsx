import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left */}
        <div>
          <h2 className="text-xl font-bold">🎬 Movie Night Planner</h2>
          <p className="text-sm text-gray-400">Plan the perfect night, every time.</p>
        </div>

        {/* Center - Links */}
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white text-sm">Home</a>
          <a href="/explore" className="text-gray-400 hover:text-white text-sm">Explore</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm">Features</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a>
        </div>

        {/* Right - Social */}
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white"><FaGithub size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Movie Night Planner. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
