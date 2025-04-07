import React from 'react';

export default function About() {
  return (
    <div className="py-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-slate-800 text-center">
        About <span className="text-blue-600">Sahand Estate</span>
      </h1>

      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        <p>
          Sahand Estate is a premier real estate agency dedicated to helping clients buy, sell, and rent properties in the most sought-after neighborhoods. Our experienced agents provide expert guidance and seamless support throughout every step of the process.
        </p>

        <p>
          Our mission is to empower our clients to reach their real estate goals through trusted advice, personalized service, and a deep understanding of local markets. Whether you're a first-time buyer, a seasoned investor, or looking to rent, we’re here to guide you.
        </p>

        <p>
          With years of industry experience, our agents are passionate about delivering top-tier service. We believe that property transactions should be exciting and rewarding—and we’re committed to making that a reality for every client.
        </p>
      </div>
    </div>
  );
}
