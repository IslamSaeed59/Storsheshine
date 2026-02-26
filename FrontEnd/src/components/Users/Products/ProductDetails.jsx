import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../Services/api";
import ProductSimilar from "./ProductSimilar";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Product not found</div>;
  }

  console.log("Product details:", product);
  return (
    <div>
      <ProductCard product={product} />
      <ProductSimilar
        categoryId={product.Category?._id}
        currentProductId={product._id}
      />
    </div>
  );
};

export default ProductDetails;
