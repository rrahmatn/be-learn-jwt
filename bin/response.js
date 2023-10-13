const response = ( statusCode , data , message ,  res) => {
  res.status(statusCode).json( {
    status_code: statusCode,
    data,
    message: message,
    pagination: {
      prev: "",
      next: "",
      max: "",
    },
  });
};

module.exports = response;
