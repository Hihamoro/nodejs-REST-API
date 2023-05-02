const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "ca"] },
    })
    .required(),
  phone: Joi.string().min(8).max(99).required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({ message: "Success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await getContactById(contactId);
    if (contacts.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Found", code: 200, data: { contacts } });
  } catch (error) {}
  next(error);
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const contact = await addContact(name, email, phone);
    res.status(201).json({ message: "Created", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (contact.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Deleted", code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const contact = await updateContact(contactId, name, email, phone);
    if (contact.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Updated", code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
