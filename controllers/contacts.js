const Contact = require("../schemas/contacts");
const mongoose = require("mongoose");

const getContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  if (mongoose.Types.ObjectId.isValid(contactId)) {
    return Contact.findById(contactId);
  }
  return null;
};

const addContact = async ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

const updateContact = async (contactId, { name, email, phone }) => {
  return Contact.findByIdAndUpdate(
    contactId,
    { name, email, phone },
    { new: true }
  );
};

const removeContact = async (contactId) => {
  if (mongoose.Types.ObjectId.isValid(contactId)) {
    return Contact.findByIdAndRemove(contactId);
  }
  return null;
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
