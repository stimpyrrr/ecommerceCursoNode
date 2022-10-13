const { BalanceModel } = require('../models')

/**
 * @param {Object} balance
 * @param {String} balance.id
 * @param {Number} balance.balance
 * @param {String} balance.userId mongo user id
 * @returns saved balance
 */
const saveBalance = async balance => {
  console.log('balances queries: ', balance)
  const savedBalance = new BalanceModel(balance)

  await savedBalance.save()

  return savedBalance
}

/**
 * @param {String} id
 * @returns found balance
 */
const getOneBalanceByIdUser = async userId => {
  const balances = await BalanceModel.find({ userId })

  return balances
}

module.exports = {
  saveBalance,
  getOneBalanceByIdUser
}
