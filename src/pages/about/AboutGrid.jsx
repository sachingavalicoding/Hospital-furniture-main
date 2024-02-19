// AboutSection.js
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
const AboutGrid = () => {
  // Sample image URLs and content
  const galleryItems = [
    
    { imageUrl: '/assets/grid-4.jpg', title: 'ICU', description: '/assets/grid-title.jpg' },
    { imageUrl: '/assets/grid-5.jpg', title: 'OPD', description: '/assets/grid-title.jpg' },
    { imageUrl: '/assets/grid-6.jpg', title: 'BED', description: '/assets/grid-title.jpg' },
    // Add more items as needed
  ];
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
    <div   className=" h-full w-[80%]  mx-auto mt-8">
      <Slider {...settings} className="grid grid-cols-1  gap-4">
        {galleryItems.map((item, index) => (
          <div key={index} className="relative top-0 overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full md:w-full object-cover transition-transform transform scale-100  hover:scale-105 "
            />
            <div className="overlay absolute inset-0 flex flex-col items-center justify-end opacity-0 transition-opacity duration-300 hover:opacity-100">
              <div className="text-white text-center">
                <h3 className="text-6xl  font-semibold">{item.title}</h3>
                <Link to={"/products"}>
                    <img src={item.description} alt="alt" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AboutGrid;
