const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all expenses for user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new expense
router.post('/', auth, async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    const expense = new Expense({
      description,
      amount,
      category,
      user: req.user._id
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// Delete expense
// Delete expense
router.delete('/:id', auth, async (req, res) => {
 try {
   const expense = await Expense.findOne({
     _id: req.params.id,
     user: req.user._id
   });

   if (!expense) {
     return res.status(404).json({ message: 'Expense not found' });
   }

   await Expense.findByIdAndDelete(req.params.id);
   res.json({ message: 'Expense deleted successfully' });
 } catch (error) {
   res.status(500).json({ message: 'Server error', error: error.message });
 }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
 try {
   const { description, amount, category } = req.body;
   
   const expense = await Expense.findOne({
     _id: req.params.id,
     user: req.user._id
   });

   if (!expense) {
     return res.status(404).json({ message: 'Expense not found' });
   }

   const updatedExpense = await Expense.findByIdAndUpdate(
     req.params.id,
     { description, amount, category },
     { new: true, runValidators: true }
   );

   res.json(updatedExpense);
 } catch (error) {
   res.status(400).json({ message: 'Invalid data', error: error.message });
 }
});

module.exports = router;