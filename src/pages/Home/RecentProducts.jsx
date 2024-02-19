// src/components/RecentProducts.js
import { Link } from "react-router-dom";
import SectionTitle from "../../components/ui/SectionTItle";


const productsData = [
  {
    "id": 1,
    "title": "ICU BED SOLUTIONS",
    "image": "/images/M-2.jpg"
  },
  {
    "id": 2,
    "title": "WARD BED SOLUTIONS",
    "image": "/images/M-15.jpg"
  },
  {
    "id": 3,
    "title": "OT SOLUTIONS",
    "image": "/images/M-28.jpg"
  },
  {
    "id": 4,
    "title": "OPD SOLUTIONS",
    "image": "/images/M-38.jpg"
  },
];

const RecentProducts = () => {
  return (

    <section className=" container mx-auto flex flex-wrap justify-around mt-10">

      {productsData.map((product) => (
         <Link to={`/products/${product.id}?img=${product.image}`} key={product.id}>

        <div key={product.id} className="relative overflow-hidden  m-4 w-64 h-64 rounded-md"> 
              <img
                src={product.image}
                alt={product.title}
                className="object-cover  w-full h-full transition-transform transform hover:scale-105 rounded-lg  "
              />
        
          <div className="absolute inset-0  flex items-center justify-center bg-slate-100 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <p className="text-black  text-center">{product.title}</p>
          </div>
        </div>
        </Link>
      ))}
    </section>
  );
};

export default RecentProducts;
