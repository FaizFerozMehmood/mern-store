import sendResponse from "../helpers/sendResponse.js";
import Product from "../models/productModel.js";

export const addProduct = async (req, res) => {
  //   console.log("request body in", req.body);

  try {
    const { productName,category, image, price, title, des } = req.body;

    if (!productName || !category|| !price || !title || !des) {
      return sendResponse(res, 403, null, true, "All fields are required!");
    }
    const newProduct = new Product({ productName, category, image, price, title, des });

    await newProduct.save();

    sendResponse(res, 201, newProduct, false, "product added successfully!");
  } catch (error) {
    console.log("error adding product  ====>  ", error);

    return sendResponse(res, 500, null, true, "internal server error", error);
  }
};

export const deleteProduct = async (req, res) => {
  // const productId = req.parmas.id;
  const { id } = req.params;
  try {
    if (!id) return sendResponse(res, 404, null, true, "product not found!");
    const removeProduct = await Product.findByIdAndDelete(id);
    if (!removeProduct)
      return sendResponse(
        res,
        404,
        null,
        true,
        "product not found or already deleted!"
      );
    sendResponse(res, 200, null, false, "product deleted successfully!");
  } catch (error) {
    return sendResponse(res, 500, null, true, "Internal server error", error);
  }
};

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
    return sendResponse(res, 500, null, true, "Internal server error", error);
  }
};
