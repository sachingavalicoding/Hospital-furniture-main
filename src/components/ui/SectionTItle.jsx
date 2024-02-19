// src/components/SectionTitle.js
import React from 'react';

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center mt-16">
      <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-2 relative inline-block">
        {title}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-full  bg-blue-500"></div>
      </h2>
      <p className="text-lg md:text-xl text-gray-600">{subtitle}</p>
    </div>
  );
};

export default SectionTitle;
