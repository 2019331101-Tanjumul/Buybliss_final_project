// frontend/src/components/Wishlist.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { useUserStorage } from "../hooks/useLocalStorage";
import { useWishlist } from "../context/WishlistContext";
import { getWishlist, removeFromWishlist, fetchProductDetails } from "../utils/actions";

const Wishlist = () => {
  const navigate = useNavigate();
  const { getUser } = useUserStorage();
  const { updateWishlistCount } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});
  const user = getUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getWishlist(user.email);
        setWishlistItems(items);

        // Fetch product details for each item
        const productDetails = {};
        for (const item of items) {
          const details = await fetchProductDetails(item.productDetailsLink);
          productDetails[item.productDetailsLink] = details;
        }
        setProducts(productDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  if (!user) {
    navigate("/");
    return;
  }

  const handleRemoveFromWishlist = async (productDetailsLink) => {
    const user = getUser();
    if (!user) return;

    try {
      await removeFromWishlist(user.email, productDetailsLink);
      setWishlistItems((items) => items.filter((item) => item.productDetailsLink !== productDetailsLink));
      updateWishlistCount();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  if (loading) {
    return <div className="products-container">Loading...</div>;
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
              <span className="company">{product.company}</span>
              <div className="product-img-container">
                <img
                  src={product.imageUrls[0]}
                  alt={product.title}
                  className="product-img"
                  onClick={() => navigate(`/product-details/${item.productDetailsLink}`)}
                />
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
