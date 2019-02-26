module.exports = {
  httpStatus: {
    ok: 200,
    badRequest: 400,
    notFound: 404,
    unauthorized: 401,
    forbidden: 403,
    internalServerError: 500,
  },
  errorCodes: {
    serviceDataNotFound: 1000,
    serviceCallFailed: 1001,
    serviceAliasExcluded: 1002,
  },
};
