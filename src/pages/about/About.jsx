// src/pages/AboutUs.js
import React from 'react';
import { Link } from 'react-router-dom';
import AboutGrid from './AboutGrid';
const AboutUs = () => {
  // Replace these values with your actual data
  const ownerName = "Mayur Wagh";
  const companyName = "Shree Jagadamba Production ";
  const companySubtitle = "Provide hospital furniture for every need";
  const companyDescription =
    "Shree Jagadamba Production crafts premium hospital furniture, elevating healthcare spaces with precision and care. Led by owner Rajesh Sharma, our commitment to quality shines through in every product, from robust hospital beds to ergonomic seating. Trust us to furnish your medical facility with innovation, reliability, and a touch of timeless craftsmanship";
  const companyLocationMapUrl = "https://www.google.com/maps/place/18%C2%B026'50.5%22N+73%C2%B053'42.0%22E/@18.4496446,73.8940981,14.7z/data=!4m4!3m3!8m2!3d18.4473512!4d73.8949912?hl=en&entry=ttu"; // Replace with your map URL
  const companyStartDate = "January 1, 2022";
  const companyProducts = ["Hospital Bed", "Medical Cabinets", "Patient Lifts"];
  const salesData = [
    { month: "2022", sales: 1000 },
    { month: "2023", sales: 1500 },
    { month: "2024", sales: 200 },
  ];

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="grid grid-cols-1  gap-8">
        {/* Image Column */}
        <div className="mb-4 md:mb-0">
          <img
            src="/assets/about-img.jpg" // Replace with your company image URL
            alt="Company Image"
            className="w-full h-auto rounded-md"
          />
        </div>

        {/* Information Column */}
        <div>
          <h2 className="text-3xl font-semibold mb-4">{companyName}</h2>
          <h4 className="text-xl text-gray-600 mb-4">{companySubtitle}</h4>

          <p className="text-gray-600 mb-4">{companyDescription}</p>

          <p className="text-gray-600 mb-4">
            <strong>Owner:</strong> {ownerName}
          </p>

          <p className="text-gray-600 mb-4">
            <strong>Founded:</strong> {companyStartDate}
          </p>

          <p className="text-gray-600 mb-4">
            <strong>Location:</strong>{" "}
            <a href={companyLocationMapUrl} target="_blank" rel="noopener noreferrer" className='text-blue-800 font-bold underline'>
              View on Map
            </a>
          </p>

          <div className="mb-4">
            <strong>Products:</strong>
            <ul className="list-disc ml-4">
              {companyProducts.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
            <Link className=' font-bold px-3 py-1 text-blue-800 underline mt-4 ' to={"/products"}> ...Check more </Link>
          </div>

          <div>
            <strong>Sales Data:</strong>
            <table className="w-full text-center border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Year</th>
                  <th className="border border-gray-300 p-2">Sales</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map(({ month, sales }, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{month}</td>
                    <td className="border border-gray-300 p-2">{sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AboutGrid />
    </div>
  );
};

export default AboutUs;
