import AboutUs from "./AboutUs/AboutUs";
import Hero from "./Banner/Hero";
import BestProduct from "./BestProduct/BestProduct";
import Bestsellers from "./Bestsellers/Bestsellers";
import Category from "./Category/Category";

const Home = () => {
  return (
    <>
      <Hero />
      <Category />
      <BestProduct />
      <Bestsellers />
      <AboutUs />
    </>
  );
};

export default Home;
