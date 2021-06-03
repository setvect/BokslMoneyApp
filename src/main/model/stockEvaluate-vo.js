import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";
import stockVo from "./stock-vo.js";

const stockEvaluateVo = connSeque.define(
  "stockEvaluate",
  {
    stockEvaluateSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    stockSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buyAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    evaluateAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    classMethods: {},
    tableName: "EC_STOCK_EVALUATE",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

stockEvaluateVo.belongsTo(stockVo, {
  foreignKey: "stockSeq",
});

export default stockEvaluateVo;
