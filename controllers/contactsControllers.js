import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
  const list = await contactsService.listContacts();

  res.json(list);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (contact) {
    res.json(contact);
  } else {
    next(HttpError(404));
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  const contact = await contactsService.removeContact(id);

  if (contact) {
    res.json(contact);
  } else {
    next(HttpError(404));
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const contact = await contactsService.addContact(name, email, phone);

  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.updateContact(id, req.body);

  if (contact) {
    res.json(contact);
  } else {
    next(HttpError(404));
  }
};
