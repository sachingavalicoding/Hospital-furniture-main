// src/components/TestimonialSlider.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonialsData = [
  {
    id: 1,
    avatar: '/assets/avtar/avtar-1.jpg',
    "name": "Avinash Sharma",
    "email": "avinash@example.com",
    "feedback": "Shree Jagadamba Production stands out for its exceptional hospital furniture. The durability and comfort provided by their products are unmatched. The team's professionalism and commitment to quality make them a reliable choice for any medical facility.",
    date: '2022-02-20',
  },
  {
    id: 2,
    avatar: '/assets/avtar/avtar-3.jpg',
    "name": "Vikram Singh",
      "email": "vikram@example.com",
      "feedback": "I am impressed with the range of hospital furniture offered by Shree Jagadamba Production. The attention to detail and commitment to customer satisfaction are praiseworthy. The furniture adds a touch of sophistication to our medical setup.",
    date: '2022-02-21',
  },
  {
    id: 3,
    avatar: '/assets/avtar/avtar-1.jpg',
    "name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "feedback": "Shree Jagadamba Production exceeded my expectations. The hospital furniture is not only functional but also aesthetically pleasing. The attention to detail and customer service are exceptional.",
    date: '2023-08-12',
  },
  {
    id: 4,
    avatar: '/assets/avtar/avtar-3.jpg',
    "name": "Amit Khanna",
    "email": "amit@example.com",
    "feedback": "Shree Jagadamba Production's hospital furniture transformed our medical facility. The comfort, durability, and modern design are perfect for creating a positive environment for patients and staff.",
    date: '2022-02-23',
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 5000,
  };

  return (
    <Slider {...settings} className=" px-8   md:mx-auto mt-16 max-w-2xl   text-slate-50 ">
    {testimonialsData.map(testimonial => (
      <div key={testimonial.id} className=" px-6 py-4 bg-indigo-500  relative left-0 top-0 rounded-md ">
        <img src={testimonial.avatar} alt={testimonial.name} className="rounded-full mx-auto mb-2 w-16 static " />
        <div className='flex flex-col gap-1 '>
        <h3 className="text-lg font-bold">{testimonial.name}</h3>
        <p className="text-sm text-gray-900">{testimonial.email}</p>
        <p className="text-base mt-2">{testimonial.feedback}</p>
        <p className="text-sm font-bold text-gray-900">{testimonial.date}</p>
        </div>
      </div>
    ))}
  </Slider>
  );
};

export default Testimonials;
