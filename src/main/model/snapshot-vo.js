import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";
import assetGroupVo from "./assetGroup-vo.js";
import stockEvaluateVo from "./stockEvaluate-vo.js";

const snapshotVo = connSeque.define(
  "snapshot",
  {
    snapshotSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    note: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    regDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    stockSellCheckDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    classMethods: {},
    tableName: "EA_SNAPSHOT",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

snapshotVo.hasMany(assetGroupVo, {
  foreignKey: "snapshotSeq",
});
snapshotVo.hasMany(stockEvaluateVo, {
  foreignKey: "snapshotSeq",
});

export default snapshotVo;
