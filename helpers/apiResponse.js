exports.successResponse = (res, msg) => {
  const data = {
    status: 1,
    message: msg,
  };
  return res.status(200).json(data);
};
exports.successResponseWithData = (res, msg, inputData) => {
  const data = {
    status: 1,
    message: msg,
    data: inputData,
  };
  return res.status(200).json(data);
};

exports.errorResponse = (res, msg) => {
  const data = {
    status: 0,
    message: msg,
  };
  return res.status(500).json(data);
};

exports.notFoundResponse = (res, msg) => {
  const data = {
    status: 0,
    message: msg,
  };
  return res.status(404).json(data);
};

exports.validationErrorWithData = (res, msg, inputData) => {
  const data = {
    status: 0,
    message: msg,
    data: inputData,
  };
  return res.status(400).json(data);
};

exports.unauthorizedResponse = (res, msg) => {
  const data = {
    status: 0,
    message: msg,
  };
  return res.status(401).json(data);
};
