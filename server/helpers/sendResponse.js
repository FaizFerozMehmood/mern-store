export default function sendResponse(res,status,data,error,msg) {
    return res.status(status).json({
      error,
      msg,
      data,
    });
  }