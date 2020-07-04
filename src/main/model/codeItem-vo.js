import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";
import codeMainVo from "./codeMain-vo.js";

const codeItemVo = connSeque.define(
  "codeItem",
  {
    codeMainId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    codeItemSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    tableName: "CB_CODE_ITEM",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

codeItemVo.belongsTo(codeMainVo, { foreignKey: "codeMainId", });
export default codeItemVo;
