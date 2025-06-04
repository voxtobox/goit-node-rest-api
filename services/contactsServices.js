import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('./db/contacts.json');

async function writeList(list) {
  await fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
}

export async function listContacts() {
  const raw = await fs.readFile(contactsPath);
  return JSON.parse(raw);
}

export async function getContactById(contactId) {
  const list = await listContacts();
  return list.find(item => item.id === contactId) || null;
}

export async function removeContact(contactId) {
  const list = await listContacts();
  const index = list.findIndex(item => item.id === contactId);
  if (index === -1) return null;
  const deleted = list.splice(index, 1);
  await writeList(list);
  return deleted[0];
}

export async function addContact(name, email, phone) {
  const list = await listContacts();
  const newItem = { name, email, phone, id: nanoid() };
  list.push(newItem);
  await writeList(list);
  return newItem;
}

export async function updateContact(id, data) {
  const list = await listContacts();
  const contact = list.find(item => item.id === id);

  if (!contact) return null;

  Object.assign(contact, data);

  await writeList(list);

  return contact;
}
