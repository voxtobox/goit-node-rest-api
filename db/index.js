import { sequelize } from './sequelize.js';
import { User } from './user.js';
import { Contact } from './contact.js';
import { setupAssociations } from './associations.js';

setupAssociations();

(async () => {
  await sequelize.sync({ force: true });
})();

export { User, Contact };
