const { model, Schema } = require('mongoose')

const BalanceSchema = new Schema(
  {
    id: {
      required: true,
      type: String,
      unique: true
    },
    balance: {
      required: true,
      type: Number
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      transform: (_, ret) => {
        delete ret._id
      }
    }
  }
)

const BalanceModel = model('balances', BalanceSchema)

module.exports = BalanceModel
