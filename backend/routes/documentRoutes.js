const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const Document = require("../models/Document");

// Create new document
router.post("/", protect, async (req, res) => {
  try {
    const doc = new Document({
      title: "Untitled Document",
      content: "",
      owner: req.user,
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get document by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user }, { collaborators: req.user }],
    }).populate("owner collaborators", "name email");

    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update document
router.put("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ owner: req.user }, { collaborators: req.user }],
      },
      { content: req.body.content, title: req.body.title },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
