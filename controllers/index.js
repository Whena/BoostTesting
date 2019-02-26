/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable camelcase */
const axios = require('axios');
const ServiceUrl = require('../models/service-url');
const { httpStatus, errorCodes } = require('../configs/codes');

String.prototype.toKebabCase = function () {
  return this.toLowerCase().replace(new RegExp('\\s', 'g'), '-');
};

const gateway = {
  list: async (req, res) => {
    try {
      const { page, limit } = req.query;

      delete req.query.page;
      delete req.query.limit;

      const data = await ServiceUrl.findAndCountAll({
        where: req.query,
        offset: page && limit ? (page - 1) * limit : 0,
        limit,
      });

      return res.status(httpStatus.ok).json({
        status: httpStatus.ok,
        success: true,
        data,
      });
    } catch (e) {
      return res.status(httpStatus.internalServerError).json({
        status: httpStatus.internalServerError,
        success: false,
        message: e,
      });
    }
  },
  show: async (req, res) => {
    try {
      const data = await ServiceUrl.findOne({ where: { id: req.params.id } });

      return res.status(httpStatus.ok).json({
        status: httpStatus.ok,
        success: true,
        data,
      });
    } catch (e) {
      return res.status(httpStatus.internalServerError).json({
        status: httpStatus.internalServerError,
        success: false,
        message: e,
      });
    }
  },
  create: async (req, res) => {
    try {
      req.checkBody({
        svc_name: {
          notEmpty: true,
          errorMessage: 'svc_name is required',
        },
        url: {
          notEmpty: true,
          errorMessage: 'url is required',
        },
      });

      const errors = req.validationErrors();

      if (errors) {
        return res.status(httpStatus.badRequest).json({
          status: httpStatus.badRequest,
          success: false,
          message: errors,
        });
      }

      const {
        svc_name,
        url,
        alias,
        is_active,
      } = req.body;

      const validAlias = alias ? alias.toKebabCase() : svc_name.toKebabCase();
      const exclude = JSON.parse(process.env.GATEWAY_EXCLUDE);

      if (exclude.indexOf(validAlias) !== -1) {
        return res.status(httpStatus.badRequest).json({
          status: httpStatus.badRequest,
          statusCode: errorCodes.serviceAliasExcluded,
          success: false,
          message: 'Sorry, but it seems that the service name / alias that you input was deemed invalid because it has been excluded on the environment file.',
        });
      }

      const data = await ServiceUrl.create({
        svc_name,
        url: url.toLowerCase(),
        alias: validAlias,
        is_active,
      });

      return res.status(httpStatus.ok).json({
        status: httpStatus.ok,
        success: true,
        data,
      });
    } catch (e) {
      return res.status(httpStatus.internalServerError).json({
        status: httpStatus.internalServerError,
        success: false,
        message: e,
      });
    }
  },
  update: async (req, res) => {
    try {
      if (req.body.alias) {
        req.body.alias = req.body.alias.toKebabCase();
        const exclude = JSON.parse(process.env.GATEWAY_EXCLUDE);

        if (exclude.indexOf(req.body.alias) !== -1) {
          return res.status(httpStatus.badRequest).json({
            status: httpStatus.badRequest,
            statusCode: errorCodes.serviceAliasExcluded,
            success: false,
            message: 'Sorry, but it seems that the alias that you input was deemed invalid because it has been excluded on the environment file.',
          });
        }
      }

      const data = await ServiceUrl.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      return res.status(httpStatus.ok).json({
        status: httpStatus.ok,
        success: true,
        data: { updated_count: data[0] },
      });
    } catch (e) {
      return res.status(httpStatus.internalServerError).json({
        status: httpStatus.internalServerError,
        success: false,
        message: e,
      });
    }
  },
  // eslint-disable-next-line consistent-return
  redirect: async (req, res) => {
    try {
      const { name, 0: pathname } = req.params;

      const data = await ServiceUrl.findOne({
        where: {
          alias: name.toKebabCase(),
          is_active: true,
        },
      });

      if (!data) {
        return res.status(httpStatus.badRequest).json({
          status: httpStatus.badRequest,
          statusCode: errorCodes.serviceDataNotFound,
          success: false,
          message: 'Sorry, but the service data was not found.',
        });
      }

      const queries = Object.keys(req.query);
      const parsedQueries = [];

      queries.forEach(query => parsedQueries.push(`${query}=${req.query[query]}`));

      axios({
        method: req.method,
        url: `${data.url}/${pathname || ''}${parsedQueries.length > 0 ? `?${parsedQueries.join('&')}` : ''}`,
        headers: req.headers,
        data: req.body,
      })
        .then(result => res.status(httpStatus.ok).json({
          status: httpStatus.ok,
          success: true,
          data: result.data,
        }))
        .catch(err => res.status(httpStatus.badRequest).json({
          status: httpStatus.badRequest,
          statusCode: errorCodes.serviceCallFailed,
          success: false,
          message: err.response || err.code,
        }));
    } catch (e) {
      return res.status(httpStatus.internalServerError).json({
        status: httpStatus.internalServerError,
        success: false,
        message: e,
      });
    }
  },
};

module.exports = (router) => {
  router.all('/ping', (req, res) => {
    const {
      method,
      body,
      params,
      query,
    } = req;

    return res.status(httpStatus.ok).json({
      message: 'PONG!',
      data: {
        method,
        body,
        params,
        query,
      },
    });
  });
  router.get('/admin', gateway.list);
  router.get('/admin/:id', gateway.show);
  router.post('/admin', gateway.create);
  router.put('/admin/:id', gateway.update);
  router.patch('/admin/:id', (req, res, next) => { req.body = { is_active: true }; return next(); }, gateway.update);
  router.delete('/admin/:id', (req, res, next) => { req.body = { is_active: false }; return next(); }, gateway.update);
  router.all('/:name', gateway.redirect);
  router.all('/:name/*', gateway.redirect);
};
