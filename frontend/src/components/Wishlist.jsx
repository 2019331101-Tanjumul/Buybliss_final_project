// frontend/src/components/Wishlist.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { useWishlist } from "../context/WishlistContext";
import { getWishlist, removeFromWishlist, fetchProductDetails } from "../utils/actions";
import { useUserStorage } from "../hooks/useUserStorage";
import { Spinner } from "./ui/Spinner";
import { CompanyLogo } from "./CompanyLogo";

const Wishlist = () => {
  const navigate = useNavigate();
  const { updateWishlistCount } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const user = useUserStorage().getUser();

  useEffect(() => {
    if (!user?.email) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const items = await getWishlist(user.email);
        setWishlistItems(items);

        const productDetails = {};
        for (const item of items) {
          const details = await fetchProductDetails(item.productDetailsLink, item?.company);
          productDetails[item.productDetailsLink] = details;
          console.log(details);
        }
        setProducts(productDetails);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  const handleRemoveFromWishlist = async (productDetailsLink) => {
    try {
      await removeFromWishlist(user?.email, productDetailsLink);
      setWishlistItems((items) => items.filter((item) => item.productDetailsLink !== productDetailsLink));
      updateWishlistCount(user?.email);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="products-container">
        <img src="/empty-box.jpg" alt="Empty Wishlist" className="empty-product-img" />
        <div className="pagination">
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h2>My Wishlist</h2>
      <section className="product-list">
        {wishlistItems.map((item) => {
          const product = products[item.productDetailsLink];
          if (!product) return null;

          return (
            <article key={item.productDetailsLink} className="product">
              <div className="product-img-container">
                <span className="company">
                  <CompanyLogo company={product.company} />
                  <span>{product.company}</span>
                </span>
                <a href={`${product.productDetailsLink}`} target="_blank">
                  <img src={product.imageUrls[0]} alt={product.title} className="product-img" />
                </a>
              </div>
              <div className="product-content-container">
                <div className="product-content">
                  <h2 className="title">{product.title}</h2>
                  <p className="price">{item.price}৳</p>
                  <Button onClick={() => handleRemoveFromWishlist(item.productDetailsLink)}>
                    Remove from Wishlist
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Wishlist;
