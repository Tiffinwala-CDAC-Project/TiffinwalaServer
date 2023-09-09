const express = require("express");
const db = require("../db");
const multer = require('multer');
const upload = multer({dest:'uploads'});

const router = express.Router();

router.get('/meal-menu', (req, res) => {
  const selectQuery = `
    SELECT * FROM meal_menu
  `;

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve meal menu' });
    }
    res.status(200).json(results);
  });
});

router.put('/meal-menu/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const filename = req.file ? req.file.filename : null;
  const { meal_name, price } = req.body;

  const updateQuery = `
    UPDATE meal_menu
    SET meal_name = ?, price = ?, image_url = ?
    WHERE id = ?
  `;

  db.query(updateQuery, [meal_name, price, filename, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update meal menu entry' });
    }
    res.status(200).json({ message: 'Meal menu entry updated successfully' });
  });
});

module.exports = router;
