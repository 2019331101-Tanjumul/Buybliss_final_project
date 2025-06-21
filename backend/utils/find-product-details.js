import { getRyansSearchedProductDetails } from "./ryans.js";
import { getStarTecSearchedProductDetails } from "./star-tech.js";

export const findProductDetails = async (url) => {
  try {
    const ryansProductDetails = await getRyansSearchedProductDetails(url);
    const starTechProductDetails = await getStarTecSearchedProductDetails(url);
    return ryansProductDetails.title ? ryansProductDetails : starTechProductDetails;
  } catch (error) {
    console.log(error);
  }
}