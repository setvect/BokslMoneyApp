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
      defaultValue: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
codeMainVo.hasMany(codeItem, { foreignKey: "code_main_id", });

export default codeMainVo;
