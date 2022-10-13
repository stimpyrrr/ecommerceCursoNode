const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const UserService = require('./user')
const RoleService = require('./role')
const BalanceService = require('./balance')
const {
  mongo: { queries }
} = require('../database')
const {
  article: { saveArticle, getOneArticle, updateArticleUser }
} = queries

class ArticleService {
  #id
  #name
  #description
  #price
  #userId

  /**
   * @param {Object} args
   * @param {String|undefined} args.id
   * @param {String|undefined} args.name
   * @param {String|undefined} args.description
   * @param {Number|undefined} args.price
   * @param {String|undefined} args.userId
   */
  constructor(args) {
    console.log('args article: ', args)
    const {
      id = '',
      name = '',
      description = '',
      price = '',
      userId = ''
    } = args

    this.#id = id
    this.#name = name
    this.#description = description
    this.#price = price
    this.#userId = userId
  }

  async saveArticle() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const userService = new UserService({ userId: this.#userId })
    const foundUser = await userService.verifyUserExists()

    const newArticle = await saveArticle({
      id: nanoid(6),
      name: this.#name,
      description: this.#description,
      price: this.#price,
      userId: foundUser._id // Mongo user id
    })

    return newArticle.toObject()
  }

  async getArticle() {
    console.log('en el getarticle: ', this.#id)
    if (!this.#id) throw new httpErrors.BadRequest('Missing required field: id')

    const foundArticle = await getOneArticle(this.#id)

    if (!foundArticle) throw new httpErrors.NotFound('Article not found')

    return foundArticle
  }

  async buyArticle() {
    // console.log('en el buyArticle: ', this.#id);
    if (!this.#id) throw new httpErrors.BadRequest('Missing required field: id')

    const foundArticle = await getOneArticle(this.#id)
    const userService = new UserService({ userId: this.#userId })
    const foundUser = await userService.verifyUserExists()

    const roleService = new RoleService({ id: 3 }) // Client
    const roleClientService = await roleService.getRoleByID()

    if (String(roleClientService._id) !== String(foundUser.role))
      throw new httpErrors.NotFound('Role is not a Client')

    if (!foundArticle) throw new httpErrors.NotFound('Article not found')

    const balanceService = new BalanceService({ userId: this.#userId })
    const totalBalanceClient = await balanceService.getOneBalanceByIdUser()

    if (foundArticle.price > totalBalanceClient)
      throw new httpErrors.NotFound('Balance is not unsuficient')

    const balanceServiceClient = new BalanceService({
      balance: foundArticle.price * -1,
      userId: this.#userId
    })
    const updateBalanceClient = await balanceServiceClient.saveBalance()

    const balanceServiceSeller = new BalanceService({
      balance: foundArticle.price,
      userId: foundArticle.userId.id
    })
    const updateBalanceSeller = await balanceServiceSeller.saveBalance()

    const updateUser = await this.updateArticleUser()

    console.log('foundArticle es: ', foundArticle.userId)

    return updateUser
  }

  async updateArticleUser() {
    const buyerUser = await new UserService({
      userId: this.#userId
    }).getUserByID()

    return await updateArticleUser({
      id: this.#id,
      userId: buyerUser._id
    })
  }
}

module.exports = ArticleService
