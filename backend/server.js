const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const { Parser } = require("json2csv");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = "expense_tracker_secret";

app.use(cors());
app.use(express.json());

const db = new Database("finance_tracker.db");

// ======================
// CREATE TABLE
// ======================
db.prepare(`
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  date TEXT NOT NULL
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS budgets (
  category TEXT PRIMARY KEY,
  limit_amount REAL NOT NULL
)
`).run();

db.prepare(`
INSERT OR IGNORE INTO budgets
(category, limit_amount)
VALUES
('Food',5000),
('Transport',2000),
('Bills',3000),
('Entertainment',4000),
('Other',2000)
`).run();

// ======================
// SIGNUP
// ======================

app.post("/api/auth/signup", async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "All fields are required"
    });
  }

  const existingUser = db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `).get(email);

  if (existingUser) {
    return res.status(400).json({
      error: "Email already exists"
    });
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const userId =
    crypto.randomUUID();

  db.prepare(`
    INSERT INTO users
    (id, name, email, password)
    VALUES (?, ?, ?, ?)
  `).run(
    userId,
    name,
    email,
    hashedPassword
  );

  res.status(201).json({
    message:
      "Account created successfully"
  });

});


// ======================
// LOGIN
// ======================

app.post("/api/auth/login", async (req, res) => {

  const { email, password } = req.body;

  const user = db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `).get(email);

  if (!user) {
    return res.status(400).json({
      error: "Invalid email or password"
    });
  }

  const validPassword =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!validPassword) {
    return res.status(400).json({
      error: "Invalid email or password"
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });

});

// ======================
// AUTH MIDDLEWARE
// ======================

function authenticateToken(
  req,
  res,
  next
) {

  const authHeader =
    req.headers.authorization;

  const token =
    authHeader &&
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied"
    });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err, user) => {

      if (err) {

  console.log(
    "JWT ERROR:",
    err
  );

  return res.status(403).json({
    error: err.message
  });
}
      req.user = user;

      next();
    }
  );
}



// ======================
// ADD EXPENSE
// ======================

app.post(
  "/api/expenses",
  authenticateToken,
  (req, res) => {

    const {
      amount,
      category,
      note,
      date
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error:
          "Amount must be greater than 0"
      });
    }

    if (!category ||
        category.trim() === "") {
      return res.status(400).json({
        error:
          "Category is required"
      });
    }

   const selectedDate =
  new Date(date);

const today =
  new Date();

selectedDate.setHours(
  0, 0, 0, 0
);

today.setHours(
  0, 0, 0, 0
);

if (selectedDate > today){
  return res.status(400).json({
    error:
      "Future dates are not allowed"
  });
}


if (selectedDate > today){
      return res.status(400).json({
        error:
          "Future dates are not allowed"
      });
    }

    const id =
      crypto.randomUUID();

    db.prepare(`
      INSERT INTO expenses
      (
        id,
        user_id,
        amount,
        category,
        note,
        date
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      req.user.id,
      Number(amount),
      category,
      note || "",
      date
    );

    res.status(201).json({
      message:
        "Expense added successfully",
      id
    });

  }
);



// ======================
// GET ALL EXPENSES
// FILTERS INCLUDED
// ======================

app.get(
  "/api/expenses",
  authenticateToken,
  (req, res) => {

    const {
      category,
      startDate,
      endDate
    } = req.query;

    let query =
      `SELECT * FROM expenses`;

    let conditions = [
      "user_id = ?"
    ];

    let params = [
      req.user.id
    ];

    if (category) {
      conditions.push(
        "category = ?"
      );
      params.push(category);
    }

    if (
      startDate &&
      endDate
    ) {
      conditions.push(
        "date BETWEEN ? AND ?"
      );
      params.push(
        startDate,
        endDate
      );
    }

    if (
      conditions.length > 0
    ) {
      query +=
        " WHERE " +
        conditions.join(" AND ");
    }

    query +=
      " ORDER BY date DESC";

    const expenses =
      db.prepare(query)
        .all(...params);

    res.json(expenses);

  }
);

// ======================
// GET SINGLE EXPENSE
// ======================

app.get(
  "/api/expenses/:id",
  authenticateToken,
  (req, res) => {

    const expense = db.prepare(`
      SELECT *
      FROM expenses
      WHERE id = ?
      AND user_id = ?
    `).get(
      req.params.id,
      req.user.id
    );

    if (!expense) {
      return res.status(404).json({
        error: "Expense not found"
      });
    }

    res.json(expense);

  }
);

// ======================
// UPDATE EXPENSE
// ======================

// ======================
// UPDATE EXPENSE
// ======================

app.put(
  "/api/expenses/:id",
  authenticateToken,
  (req, res) => {

    const {
      amount,
      category,
      note,
      date
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than 0"
      });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({
        error: "Category is required"
      });
    }

    const result = db.prepare(`
      UPDATE expenses
      SET amount = ?,
          category = ?,
          note = ?,
          date = ?
      WHERE id = ?
      AND user_id = ?
    `).run(
      Number(amount),
      category,
      note || "",
      date,
      req.params.id,
      req.user.id
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Expense not found"
      });
    }

    res.json({
      message: "Expense updated successfully"
    });

  }
);

// ======================
// DELETE EXPENSE
// ======================

app.delete(
  "/api/expenses/:id",
  authenticateToken,
  (req, res) => {

    const result = db.prepare(`
      DELETE FROM expenses
      WHERE id = ?
      AND user_id = ?
    `).run(
      req.params.id,
      req.user.id
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Expense not found"
      });
    }

    res.json({
      message: "Expense deleted successfully"
    });

  }
);

// ======================
// MONTHLY SUMMARY
// ======================

app.get(
  "/api/summary",
  authenticateToken,
  (req, res) => {

    const currentMonth = new Date()
      .toISOString()
      .slice(0, 7);

    const totalSpent = db.prepare(`
      SELECT IFNULL(SUM(amount),0) as total
      FROM expenses
      WHERE user_id = ?
      AND substr(date,1,7) = ?
    `).get(
      req.user.id,
      currentMonth
    );

    const highestExpense = db.prepare(`
      SELECT *
      FROM expenses
      WHERE user_id = ?
      ORDER BY amount DESC
      LIMIT 1
    `).get(
      req.user.id
    );

    res.json({
      totalSpentThisMonth:
        totalSpent.total,
      highestExpense
    });

  }
);

// ======================
// CATEGORY TOTALS
// ======================

app.get(
  "/api/category-totals",
  authenticateToken,
  (req, res) => {

    const totals = db.prepare(`
      SELECT
        category,
        SUM(amount) as total
      FROM expenses
      WHERE user_id = ?
      GROUP BY category
      ORDER BY total DESC
    `).all(
      req.user.id
    );

    res.json(totals);

  }
);

// ======================
// HIGHEST EXPENSE
// ======================

app.get(
  "/api/highest-expense",
  authenticateToken,
  (req, res) => {

    const highest = db.prepare(`
      SELECT *
      FROM expenses
      WHERE user_id = ?
      ORDER BY amount DESC
      LIMIT 1
    `).get(
      req.user.id
    );

    res.json(highest || {});

  }
);

// ======================
// GET BUDGETS
// ======================

app.get(
  "/api/budgets",
  authenticateToken,
  (req, res) => {

    const budgets = db.prepare(`
      SELECT *
      FROM budgets
      ORDER BY category
    `).all();

    res.json(budgets);

  }
);

// ======================
// UPDATE BUDGET
// ======================

app.put(
  "/api/budgets/:category",
  authenticateToken,
  (req, res) => {

    const { limit_amount } =
      req.body;

    db.prepare(`
      UPDATE budgets
      SET limit_amount = ?
      WHERE category = ?
    `).run(
      Number(limit_amount),
      req.params.category
    );

    res.json({
      message:
        "Budget updated successfully"
    });

  }
);

// ======================
// CSV EXPORT
// ======================

app.get(
  "/api/export-csv",
  authenticateToken,
  (req, res) => {

    const expenses = db.prepare(`
      SELECT *
      FROM expenses
      WHERE user_id = ?
      ORDER BY date DESC
    `).all(
      req.user.id
    );

    const parser = new Parser();

    const csv = parser.parse(
      expenses
    );

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment(
      "expenses.csv"
    );

    return res.send(csv);

  }
);

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