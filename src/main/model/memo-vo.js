import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";

const memoVo = connSeque.define(
  "memo",
  {
    memoSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    note: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    memoDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    classMethods: {},
    tableName: "BD_MEMO",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

export default memoVo;
