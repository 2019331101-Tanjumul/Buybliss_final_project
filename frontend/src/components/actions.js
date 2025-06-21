// frontend/src/utils/actions.jsx

import axios from "axios";

export async function fetchProducts(searchKey, currentPage) {
  const response = await axios.get(`http://localhost:3000/products/${searchKey}/${currentPage}`);
  console.log(response.data.data);
  return response.data.data;
}

export async function fetchProductDetails(url) {
  const response = await axios.get(`http://localhost:3000/products/${url}`);
  console.log(response.data.data);
  return response.data.data;
}

export async function login(email, password) {
  const response = await axios.post(`http://localhost:3000/auth/login`, { email, password }, { withCredentials: true });
  return response.data.data
}

export async function getCurrentUser() {
  const response = await axios.get(`http://localhost:3000/users/current-user`, { withCredentials: true });
  return response.data.data;
}

export async function logout() {
  const response = await axios.get(`http://localhost:3000/auth/logout`, { withCredentials: true });
  return response.data.data;
}

export async function addToWishlist(productDetailsLink, price, company, email) {
  const response = await axios.post(
    `http://localhost:3000/wishlist/add`,
    { productDetailsLink, price, company, email },
    { withCredentials: true }
  );
  return response.data.data;
}

export async function getWishlist(email) {
  const response = await axios.get(`http://localhost:3000/wishlist/${email}`, { withCredentials: true });
  return response.data.data;
}

export async function removeFromWishlist(email, productDetailsLink) {
  const response = await axios.delete(
    `http://localhost:3000/wishlist/${email}/${encodeURIComponent(productDetailsLink)}`,
    { withCredentials: true }
  );
  return response.data.data;
}