import sendResponse from "../helpers/sendResponse.js";

const adminRole = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, 401, null, true, "Unauthorized: No user data found.");
    }

    if (req.user.role !== "admin") {
      return sendResponse(res, 403, null, true, "Access denied: Admins only.");
    }

    next(); 
  } catch (error) {
    next(error);
  }
};

export const publicAccess = async (req,res,next)=>{
  try {
  if(!req.user){
    return sendResponse(res,401, null, true, "unauthorized ,no user data found!")
  }
  console.log(req.user.role);
  
  if(!(req.user.role === "admin" || req.user.role === "user")){
    return sendResponse(res,403, null, true, "can not get this route")
  }
  next()
  } catch (error) {
    next(error)
  }
}

export default adminRole;
