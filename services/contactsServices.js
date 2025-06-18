import { Contact } from '../db/index.js';

export async function listContacts(userId) {
  return await Contact.findAll({
    where: {
      owner: userId,
    },
  });
}

export async function getContactById(userId, contactId) {
  return await Contact.findOne({ where: { id: contactId, owner: userId } });
}

export async function removeContact(userId, contactId) {
  const contact = await getContactById(userId, contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export async function addContact(userId, name, email, phone) {
  const newItem = await Contact.create({ name, email, phone, owner: userId });
  return newItem.toJSON();
}

export async function updateContact(userId, id, data) {
  const contact = await getContactById(userId, id);
  if (!contact) return null;

  Object.entries(data).forEach(([key, value]) => {
    if (!value || key === 'owner') return;
    contact[key] = value;
  });

  await contact.save();

  return contact;
}

export async function updateStatusContact(userId, id, { favorite }) {
  const contact = await getContactById(userId, id);
  if (!contact) return null;

  contact.favorite = favorite;

  await contact.save();

  return contact;
}
