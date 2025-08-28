import React from "react";

const Footer = () => (
  <footer className="bg-blue-600 text-white p-4 text-center mt-8 dark:bg-gray-800">
    <span>&copy; {new Date().getFullYear()} Weather App</span>
  </footer>
);

export default Footer;
