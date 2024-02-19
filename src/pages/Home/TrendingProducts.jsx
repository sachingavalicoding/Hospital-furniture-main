// src/components/RecentProducts.js
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../../components/ui/SectionTItle";


const productsData = [
  {
    "id": 1,
    "title": "ICU BED SOLUTIONS",
    "image": "/images/M-1.jpg"
  },
  {
    "id": 2,
    "title": "WARD BED SOLUTIONS",
    "image": "/images/M-11.jpg"
  },
  {
    "id": 3,
    "title": "OT SOLUTIONS",
    "image": "/images/M-21.jpg"
  },
  {
    "id": 4,
    "title": "OPD SOLUTIONS",
    "image": "/images/M-33.jpg"
  },
  {
    "id": 5,
    "title": "OPD SOLUTIONS",
    "image": "/images/M-39.jpg"
  },
  {
    "id": 6,
    "title": "ICU PATIENT TRANSFER SOLUTIONS ",
    "image": "/images/M-51.jpg"
  },
     
];

const TrendingProducts = () => {
  const navigate = useNavigate();
  return (

    <section className=" container mx-auto flex flex-wrap gap-7 justify-around mt-10">
       
      {productsData.map((product) => (
        <Link to={`/products/${product.id}?img=${product.image}`} key={product.id} >
        <div  className="relative overflow-hidden m-4 w-72 h-72  rounded-md">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full transition-transform transform hover:scale-105"
            onClick={()=> navigate("/products")}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-center">{product.title}</p>
          </div>
        </div>
        </Link>
      ))}
    </section>
  );
};

export default TrendingProducts;
