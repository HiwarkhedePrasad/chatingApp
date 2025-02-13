import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-black py-24 text-center">
      {" "}
      {/* Gradient background */}
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          {" "}
          {/* Center content and limit width */}
          <h1 className="text-6xl font-extrabold text-white tracking-wide leading-tight mb-6">
            {" "}
            {/* Larger, bolder text */}
            Connect. Collaborate. Create.
          </h1>
          <p className="text-2xl text-gray-300 leading-relaxed mb-10">
            {" "}
            {/* Improved spacing and readability */}
            Unleash the power of real-time communication with AI-driven
            insights. Experience seamless video calls, enhanced collaboration,
            and limitless creative possibilities.
          </p>
          <div className="flex justify-center">
            {" "}
            {/* Center buttons */}
            <Link
              to="/call"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mr-4 transition duration-300"
            >
              Start Calling
            </Link>
            <Link
              to="/about"
              className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
