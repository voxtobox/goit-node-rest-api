import { Contact } from '../db/index.js';

export async function listContacts() {
  return await Contact.findAll();
}

export async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

export async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export async function addContact(name, email, phone) {
  const newItem = await Contact.create({ name, email, phone });
  return newItem.toJSON();
}

export async function updateContact(id, data) {
  const contact = await getContactById(id);
  if (!contact) return null;

  Object.entries(data).forEach(([key, value]) => {
    if (!value) return;
    contact[key] = value;
  });

  await contact.save();

  return contact;
}

export async function updateStatusContact(id, { favorite }) {
  const contact = await getContactById(id);
  if (!contact) return null;

  contact.favorite = favorite;

  await contact.save();

  return contact;
}
