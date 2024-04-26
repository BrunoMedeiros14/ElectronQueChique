import { Options, Sequelize } from 'sequelize';

const dbConfig: Options = {
  dialect: 'sqlite',
  storage: './database.sqlite',
  define: {
    underscored: true
  }
}

export const connection = new Sequelize(dbConfig);