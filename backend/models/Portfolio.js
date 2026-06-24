const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  balance:{
    type:Number,
    default:10000
  },

  totalProfit:{
    type:Number,
    default:0
  },

  totalLoss:{
    type:Number,
    default:0
  },

  holdings:[
    {
      symbol:{
        type:String
      },

      quantity:{
        type:Number
      },

      buyPrice:{
        type:Number
      },

      currentPrice:{
        type:Number
      }
    }
  ]

},
{
  timestamps:true
}
);

module.exports = mongoose.model(
"Portfolio",
portfolioSchema
);