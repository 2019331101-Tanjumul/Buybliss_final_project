import { getRyansSearchedProductDetails } from "./ryans.js";
import { getStarTechSearchedProductDetails } from "./star-tech.js";

export const findProductDetails = async (url) => {
  try {
    const ryansProductDetails = await getRyansSearchedProductDetails(url);
    const starTechProductDetails = await getStarTechSearchedProductDetails(url);
    return ryansProductDetails.title ? ryansProductDetails : starTechProductDetails;
  } catch (error) {
    console.log(error);
  }
}