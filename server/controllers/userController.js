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
    const { search } = req.query;

    if (!search) {
      return sendResponse(res, 400, null, true, "Please type to search!");
    }

    const data = await Product.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        // { description: { $regex: search, $options: "i" } },
      ],
    });

    return sendResponse(
      res,
      200,
      data,
      false,
      data.length > 0 ? "Products found!" : "No products match your search."
    );
  } catch (error) {
    console.error("Search error:", error);
    return sendResponse(res, 500, null, true, "Internal server error!");
  }
};

export const findProductCategories = async (req,res) =>{
  try {
    const category = req.query.category
    console.log("category",category)
    const filter = {}
    if(category){
      filter.category = category
    }
    console.log("filter",filter);
    
    const fileteredCatgory = await Product.find({category:category});
    console.log("filtered Category",fileteredCatgory);
    if(fileteredCatgory.length ===0){
      return sendResponse(res, 404 , null , true , "No product category found!")
    }
    sendResponse(res, 200,fileteredCatgory,false,"product category fetch successfully!" )
  } catch (error) {
    return sendResponse(res, 500, null, true, "Internal server error!");
  }
  
}