import connSeque from "./connSeque.js";
import oftenUsed from "./oftenUsed-vo.js";
import transaction from "./transaction-vo.js";

import { DataTypes } from "sequelize";

const categoryVo = connSeque.define(
  "category",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    kind: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parentSeq: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    orderNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    classMethods: {},
    tableName: "BB_CATEGORY",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);
categoryVo.hasMany(oftenUsed, { foreignKey: "category_seq" ,});
categoryVo.hasMany(transaction, { foreignKey: "category_seq", });

export default categoryVo;
