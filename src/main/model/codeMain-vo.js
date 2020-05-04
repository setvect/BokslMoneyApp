import connSeque from "./connSeque.js";
import codeItem from "./codeItem-vo";
import { DataTypes } from "sequelize";

const codeMainVo = connSeque.define(
  "codeMain",
  {
    codeMainId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    classMethods: {},
    tableName: "CA_CODE_MAIN",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);
codeMainVo.hasMany(codeItem, { foreignKey: "codeMainId", });

export default codeMainVo;
