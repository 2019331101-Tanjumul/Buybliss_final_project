// frontend/src/utils/actions.jsx

import axios from "axios";

export async function fetchProducts(searchKey, currentPage) {
  const response = await axios.get(`http://localhost:3000/products/${searchKey}/${currentPage}`);
  return response.data.data;
}

export async function fetchProductDetails(url, company) {
  const response = await axios.get(`http://localhost:3000/products//details/${url}/${company}`);
  return response.data.data;
}

export async function isAuthenticated() {
  const response = await axios.get(`http://localhost:3000/auth/check-auth`, { withCredentials: true });
  return response.data.data
}

export async function login(email, password) {
  const response = await axios.post(`http://localhost:3000/auth/login`, { email, password }, { withCredentials: true });
  return response.data.data
}

export async function getCurrentUser() {
  try {

    const response = await axios.get(`http://localhost:3000/users/current-user`, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    console.log(error)
    if (error.response.data.statusCode === 403) {
      return null
    }
    throw error;
  }
}

export async function logout() {
  const response = await axios.get(`http://localhost:3000/auth/logout`, { withCredentials: true });
  return response.data;
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