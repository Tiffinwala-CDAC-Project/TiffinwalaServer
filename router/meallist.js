const express = require("express");
const db = require("../db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // This is where the uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // Rename the file to avoid name conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST endpoint for adding a meal
router.post("/", upload.single("image"), (req, res) => {
  const { name, price, description, mealtype } = req.body;
  const imageUrl = req.file ? req.file.path : ""; // Get the uploaded image path

  const sql =
    "INSERT INTO mealslist (name, price, description, mealtype, image_url) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, price, description, mealtype, imageUrl],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to insert" });
      }

      res.status(200).json({ message: "Meal list added successfully" });
    }
  );
});

// PUT endpoint for updating a meal
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, price, description, mealtype } = req.body;

  const sql =
    "UPDATE mealslist SET name=?, price=?, description=?, mealtype=? WHERE id=?";

  db.query(
    sql,
    [name, price, description, mealtype, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update meal" });
      }
      console.log("Data updated");

      res.status(200).json({ message: "MealsList updated successfully" });
    }
  );
});

// GET endpoint for fetching all meals
router.get("/meals/all", (req, res) => {
  const sql = `SELECT id, name, price, description, mealtype, image_url FROM mealslist`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch mealslist" });
    }

    res.status(200).json(result);
  });
});

// ... (other routes)

module.exports = router;
