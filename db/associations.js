import { User } from './user.js';
import { Contact } from './contact.js';

export function setupAssociations() {
  User.hasMany(Contact, { foreignKey: 'owner' });
  Contact.belongsTo(User, { foreignKey: 'owner' });
}
