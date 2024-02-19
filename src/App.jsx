// App.js
import React, { useContext } from 'react';
import { ProductContext } from './context/ProductContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Products from './pages/products/Products';
import Navbar from './components/Navbar';
import Contact from './pages/contact/Contact';
import About from './pages/about/About';
import Footer from './components/Footer';
import ProductPreview from './pages/products/ProductPreview';
const App = () => {
  const { products} = useContext(ProductContext);

  return (
    <BrowserRouter>
    <Navbar />
     <Routes>
      <Route  path='/' element = {<Home />} />
      <Route  path='/products' element = {<Products/>} />
      <Route  path="/products/:id" element={<ProductPreview />} />
      <Route  path='/about' element = {<About/>} />
      <Route  path='/contact' element = {<Contact/>} />
     </Routes>
     <Footer />
    </BrowserRouter>
  );
};

export default App;
