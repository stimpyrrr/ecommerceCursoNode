const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const UserService = require('./user')
const {
  mongo: { queries }
} = require('../database')
const {
  balance: { saveBalance, getOneBalanceByIdUser }
} = queries

class BalanceService {
  #id
  #balance
  #userId

  /**
   * @param {Object} args
   * @param {String|undefined} args.id
   * @param {Number|undefined} args.balance
   * @param {String|undefined} args.userId
   */
  constructor(args) {
    const { id = '', balance = '', userId = '' } = args
    this.#id = id
    this.#balance = balance
    this.#userId = userId
  }

  async saveBalance() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const userService = new UserService({ userId: this.#userId })
    const foundUser = await userService.verifyUserExists()

    const newBalance = await saveBalance({
      id: nanoid(6),
      balance: this.#balance,
      userId: foundUser._id // Mongo user id
    })

    return newBalance.toObject()
  }

  async getOneBalanceByIdUser() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: id')

    const userService = new UserService({ userId: this.#userId })
    const foundUser = await userService.verifyUserExists()

    const foundBalance = await getOneBalanceByIdUser(foundUser._id)

    if (!foundBalance) throw new httpErrors.NotFound('Balance not found')

    const totalBalance = foundBalance.reduce(
      (total, obj) => obj.balance + total,
      0
    )

    return totalBalance
  }
}

module.exports = BalanceService
