import { Sequelize } from "sequelize";

const connSeque = new Sequelize({
  dialect: "sqlite",
  storage: "db/bokslmoney.db",
});

export default connSeque;
