const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const { Parser } = require("json2csv");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new Database("finance_tracker.db");

// ======================
// CREATE TABLE
// ======================

db.prepare(`
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  date TEXT NOT NULL
)
`).run();

// ======================
// ADD EXPENSE
// ======================

app.post("/api/expenses", (req, res) => {
  const { amount, category, note, date } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "Amount must be greater than 0",
    });
  }

  if (!category || category.trim() === "") {
    return res.status(400).json({
      error: "Category is required",
    });
  }

  const selectedDate = new Date(date);
  const today = new Date();

  if (selectedDate > today) {
    return res.status(400).json({
      error: "Future dates are not allowed",
    });
  }

  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO expenses
    (id, amount, category, note, date)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    Number(amount),
    category,
    note || "",
    date
  );

  res.status(201).json({
    message: "Expense added successfully",
    id,
  });
});

// ======================
// GET ALL EXPENSES
// FILTERS INCLUDED
// ======================

app.get("/api/expenses", (req, res) => {
  const { category, startDate, endDate } = req.query;

  let query = `SELECT * FROM expenses`;
  let conditions = [];
  let params = [];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (startDate && endDate) {
    conditions.push("date BETWEEN ? AND ?");
    params.push(startDate, endDate);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY date DESC";

  const expenses = db.prepare(query).all(...params);

  res.json(expenses);
});

// ======================
// GET SINGLE EXPENSE
// ======================

app.get("/api/expenses/:id", (req, res) => {
  const expense = db.prepare(`
    SELECT * FROM expenses
    WHERE id = ?
  `).get(req.params.id);

  if (!expense) {
    return res.status(404).json({
      error: "Expense not found",
    });
  }

  res.json(expense);
});

// ======================
// UPDATE EXPENSE
// ======================

app.put("/api/expenses/:id", (req, res) => {
  const { amount, category, note, date } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "Amount must be greater than 0",
    });
  }

  if (!category || category.trim() === "") {
    return res.status(400).json({
      error: "Category is required",
    });
  }

  const result = db.prepare(`
    UPDATE expenses
    SET amount = ?,
        category = ?,
        note = ?,
        date = ?
    WHERE id = ?
  `).run(
    Number(amount),
    category,
    note || "",
    date,
    req.params.id
  );

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Expense not found",
    });
  }

  res.json({
    message: "Expense updated successfully",
  });
});

// ======================
// DELETE EXPENSE
// ======================

app.delete("/api/expenses/:id", (req, res) => {
  const result = db.prepare(`
    DELETE FROM expenses
    WHERE id = ?
  `).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Expense not found",
    });
  }

  res.json({
    message: "Expense deleted successfully",
  });
});

// ======================
// MONTHLY SUMMARY
// ======================

app.get("/api/summary", (req, res) => {
  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  const totalSpent = db.prepare(`
    SELECT IFNULL(SUM(amount),0) as total
    FROM expenses
    WHERE substr(date,1,7) = ?
  `).get(currentMonth);

  const highestExpense = db.prepare(`
    SELECT *
    FROM expenses
    ORDER BY amount DESC
    LIMIT 1
  `).get();

  res.json({
    totalSpentThisMonth: totalSpent.total,
    highestExpense,
  });
});

// ======================
// CATEGORY TOTALS
// ======================

app.get("/api/category-totals", (req, res) => {
  const totals = db.prepare(`
    SELECT
      category,
      SUM(amount) as total
    FROM expenses
    GROUP BY category
    ORDER BY total DESC
  `).all();

  res.json(totals);
});

// ======================
// HIGHEST EXPENSE
// ======================

app.get("/api/highest-expense", (req, res) => {
  const highest = db.prepare(`
    SELECT *
    FROM expenses
    ORDER BY amount DESC
    LIMIT 1
  `).get();

  res.json(highest || {});
});

// ======================
// CSV EXPORT
// ======================

app.get("/api/export-csv", (req, res) => {
  const expenses = db.prepare(`
    SELECT *
    FROM expenses
    ORDER BY date DESC
  `).all();

  const parser = new Parser();

  const csv = parser.parse(expenses);

  res.header("Content-Type", "text/csv");

  res.attachment("expenses.csv");

  return res.send(csv);
});

// ======================
// HEALTH CHECK
// ======================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});