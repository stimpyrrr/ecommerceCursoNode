const { Type } = require('@sinclair/typebox')

const storeArticleSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  description: Type.String({ minLength: 2 }),
  price: Type.Number({ minLength: 1 })
})

const updateArticleSchema = Type.Partial(storeArticleSchema)

const articleIDSchema = Type.Object({
  id: Type.String({ minLength: 6 })
})

/* const articleLoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({
    minLength: 8
  })
}) */

module.exports = {
  storeArticleSchema,
  updateArticleSchema,
  articleIDSchema
}
