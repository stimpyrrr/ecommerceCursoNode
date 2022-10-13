const { Type } = require('@sinclair/typebox')

const storeBalanceSchema = Type.Object({ 
  balance: Type.Number({ minLength: 1 })
})

const updateBalanceSchema = Type.Partial(storeBalanceSchema)

const balanceIDSchema = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 })
})

/* const balanceLoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({
    minLength: 8
  })
}) */

module.exports = {
  storeBalanceSchema,
  updateBalanceSchema,
  balanceIDSchema
}
