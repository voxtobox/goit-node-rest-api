import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
  const { user } = req;
  const list = await contactsService.listContacts(user.id);

  res.json(list);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const contact = await contactsService.getContactById(user.id, id);

  if (contact) {
    res.json(contact);
  } else {
    next(HttpError(404));
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const contact = await contactsService.removeContact(user.id, id);

  if (contact) {
    res.json(contact);
  } else {
    next(HttpError(404));
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { user } = req;

  const contact = await contactsService.addContact(user.id, name, email, phone);

  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const contact = await contactsService.updateContact(user.id, id, req.body);

  if (contact) {
    res.json(contact);
  } else {
    next(HttpError(404));
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { user } = req;

  const contact = await contactsService.updateStatusContact(
    user.id,
    contactId,
    req.body
  );

  if (contact) {
    res.json(contact);
  } else {
    next(HttpError(404));
  }
};
