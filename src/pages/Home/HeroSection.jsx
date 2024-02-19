import Button from "../../components/ui/Button";
import bgImg from "/assets/bed.jpg"
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6">
           <h1> <span2xl  className="text-red-500 text-6xl font-bold "> श्री जगदंबा </span2xl> Production </h1>
          <p className="text-lg md:text-xl mt-4">"Explore our extensive range of hospital furniture for every need.</p>
          <p className="text-sm px-4 w-full md:text-base  mt-4">At <h2 className="text-2xl font-bold uppercase text-red-100 ml-2">Shree Jagadamba Production</h2>  we are dedicated to providing top-quality hospital furniture to meet the unique needs of medical facilities.  </p>
          <div className="mt-6 flex gap-10 items-center justify-center">
          <Button label="Read More " onClick={() => navigate("/products")} color="blue" />
            <Button label="Contact Us" onClick={() => navigate("/contact")} color="green" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
