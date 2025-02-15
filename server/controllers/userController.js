import sendResponse from "../helpers/sendResponse.js";
import Product from "../models/productModel.js";

export const getProduct = async (req, res) => {
  try {
    const retrieveData = await Product.find({});
    console.log("retrieveData  ===>  ", retrieveData);

    if (!retrieveData.length)
      return sendResponse(res, 404, null, true, "No products found!");

    return sendResponse(
      res,
      200,
      retrieveData,
      false,
      "Products retrieved successfully!"
    );
  } catch (error) {
    console.log("errror retrieving products ===>  ", error);
    return sendResponse(res, 500, null, true, "Internal server error");
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return sendResponse(res, 404, null, true, "please type to search!");

    const data = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
        { des: { $regex: query, $options: "i" } },
      ],
    });

    sendResponse(res, 200, data, false, "see the products against your search!");
  } catch (error) {
    return sendResponse(res, 500, null, true, "internal server error!");
  }
};

