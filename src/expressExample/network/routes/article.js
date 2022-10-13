const { Router } = require('express')
const httpErrors = require('http-errors')

const {
  article: { storeArticleSchema, updateArticleSchema, articleIDSchema }
} = require('../../schemas')
const { auth, validatorCompiler } = require('./utils')
const response = require('./response')
const { ArticleService } = require('../../services')

const ArticleRouter = Router()

ArticleRouter.route('/article/:id').post(
  validatorCompiler(storeArticleSchema, 'body'),
  auth.verifyIsCurrentUser(),
  auth.verifyUserRole(),
  async (req, res, next) => {
    try {
      const {
        params: { id: userId },
        body: { name, description, price }
      } = req

      response({
        error: false,
        message: await new ArticleService({
          name,
          description,
          price,
          userId
        }).saveArticle(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

ArticleRouter.route('/article/:id').get(
  validatorCompiler(articleIDSchema, 'params'),
  // auth.verifyIsCurrentUser(),
  // auth.verifyUserRole(),
  async (req, res, next) => {
    console.log('el req: ', req.params)
    try {
      const {
        params: { id }
      } = req

      response({
        error: false,
        message: await new ArticleService({ id }).getArticle(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  }
)

ArticleRouter.route('/buy/article/:id/:userId').post(
  // validatorCompiler(articleIDSchema, 'params'),
  // auth.verifyIsCurrentUser(),
  // auth.verifyUserRole(),
  async (req, res, next) => {
    console.log('el req: ', req.params)
    try {
      const {
        params: { id, userId }
      } = req

      response({
        error: false,
        message: await new ArticleService({
          id,
          userId
        }).buyArticle(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = ArticleRouter
