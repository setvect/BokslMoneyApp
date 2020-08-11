import connSeque from "./connSeque.js";
import {
  DataTypes
} from "sequelize";
import stockVo from "./stock-vo.js";

const tradingVo = connSeque.define(
  "stock", {
    tradingSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    stockSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kind: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    tradingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tax: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    classMethods: {},
    tableName: "DB_TRADING",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

tradingVo.belongsTo(stockVo, {
  foreignKey: "stockSeq",
});
export default tradingVo;