const express = require("express");
const Joi = require("joi");
const {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../controllers/contacts");
const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "ca"] },
    })
    .required(),
  phone: Joi.string().min(8).max(99).required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await getContacts();
    res.json({ message: "Success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Found", code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { name, email, phone } = req.body;
    const contact = await addContact({ name, email, phone });
    res.status(201).json({ message: "Created", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Deleted", code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const contact = await updateContact(contactId, { name, email, phone });
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Updated", code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const { favorite } = req.body;
  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    return res.status(404).json({ message: "Not found" });
  }
  contacts[contactIndex].favorite = favorite;
  const updatedContact = contacts[contactIndex];
  res.status(200).json(updatedContact);
});

module.exports = router;
