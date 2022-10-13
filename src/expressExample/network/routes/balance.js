const { Router } = require('express')
const httpErrors = require('http-errors')

const {
    balance: { storeBalanceSchema, updateBalanceSchema, balanceIDSchema }
  } = require('../../schemas')
const { auth, validatorCompiler } = require('./utils')
const response = require('./response')
const { BalanceService } = require('../../services')

const BalanceRouter = Router()

BalanceRouter.route('/balance/:id').post(
validatorCompiler(storeBalanceSchema, 'body'),
auth.verifyIsCurrentUser(),
async (req, res, next) => {
    try {
        const {
          params: { id: userId },
          body: { balance }
        } = req
  
        response({
          error: false,
          message: await new BalanceService({
            balance,
            userId
          }).saveBalance(),
          res,
          status: 201
        })
      } catch (error) {
        next(error)
      } 
})


BalanceRouter.route('/balance/:id').get(
validatorCompiler(balanceIDSchema, 'params'),
auth.verifyIsCurrentUser(),
async (req, res, next) => {
  const {
    params: { id }
  } = req

  try {
    const balanceService = await new BalanceService({ userId: id })    

    response({
      error: false,
      message: await balanceService.getOneBalanceByIdUser(),
      res,
      status: 200
    })
  } catch (error) {
    next(error)
  }
})

module.exports = BalanceRouter
