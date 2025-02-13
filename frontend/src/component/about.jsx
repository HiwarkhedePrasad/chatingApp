import React from "react";

const About = () => {
  return (
    <section className="bg-gray-800 py-16 text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {" "}
          {/* Center content and limit width */}
          <h2 className="text-4xl font-bold mb-6">About Us</h2>
          <p className="text-lg leading-relaxed mb-8">
            We are a team of passionate developers dedicated to building
            innovative communication solutions. Our mission is to connect people
            seamlessly through cutting-edge technology. We believe in the power
            of real-time interaction and are constantly striving to improve the
            way people connect and collaborate.
          </p>
          <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
          <p className="text-lg leading-relaxed mb-8">
            To be the leading provider of AI-enhanced communication platforms,
            empowering individuals and businesses to connect, collaborate, and
            create without boundaries.
          </p>
          <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
          <ul className="list-disc pl-6 mb-8">
            <li className="text-lg leading-relaxed">Innovation</li>
            <li className="text-lg leading-relaxed">Collaboration</li>
            <li className="text-lg leading-relaxed">User-centricity</li>
            <li className="text-lg leading-relaxed">Excellence</li>
          </ul>
          <p className="text-lg leading-relaxed">
            Learn more about our team and our journey by visiting our{" "}
            <a href="/team" className="text-blue-500 hover:text-blue-700">
              team page
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
