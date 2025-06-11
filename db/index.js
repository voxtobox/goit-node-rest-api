import { Sequelize } from 'sequelize';
import { DB_URL } from '../config/config.js';

export const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

try {
  await sequelize.authenticate();
  console.log('Database connection successful');
} catch (error) {
  console.error(error);
  process.exit(1);
}
