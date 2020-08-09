import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";
import accountVo from "./account-vo.js";

const stockVo = connSeque.define(
  "stock",
  {
    stockSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    accountSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchaseAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    classMethods: {},
    tableName: "DA_STOCK",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

stockVo.belongsTo(accountVo, { foreignKey: "accountSeq", });
export default stockVo;
