import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";
import snapshotVo from "./snapshot-vo.js";

const assetGroupVo = connSeque.define(
  "assetGroup",
  {
    assetGroupSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    accountType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
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
    tableName: "EB_ASSET_GROUP",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

export default assetGroupVo;
