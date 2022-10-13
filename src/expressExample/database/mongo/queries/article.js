const { ArticleModel } = require('../models')

/**
 * @param {Object} article
 * @param {String} article.id
 * @param {String} article.name
 * @param {String} article.description
 * @param {String} article.price
 * @returns saved article
 */
const saveArticle = async article => {
  const savedArticle = new ArticleModel(article)

  await savedArticle.save()

  return savedArticle
}

/**
 * @param {String} id
 * @returns found article
 */
const getOneArticle = async id => {
  // const articles = await ArticleModel.find({ id }).populate('userId')
  const articles = await ArticleModel.find({ id }).populate('userId')

  return articles[0]
}

const updateArticleUser = async article => {
  const { id, userId } = article
  const articleUpdated = await ArticleModel.findOneAndUpdate(
    { id },
    {
      ...(userId && { userId })
    },
    { new: true }
  )

  return articleUpdated
}

module.exports = {
  saveArticle,
  getOneArticle,
  updateArticleUser
}
