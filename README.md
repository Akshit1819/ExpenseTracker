# Personal Finance Tracker

## Project Description

Personal Finance Tracker is a full-stack web application that helps users manage and track their daily expenses. Users can add, edit, delete, and filter expenses by category and date range. The application provides expense analytics through summary cards, category-wise totals, and a pie chart visualization. Data is stored persistently using SQLite.

---

## Features

### Expense Management
- Add new expenses
- Edit existing expenses
- Delete expenses
- Category validation
- Date validation
- Optional notes

### Filtering
- Filter by category
- Filter by date range

### Analytics
- Total expenses for the current month
- Highest expense
- Category-wise expense totals
- Pie chart visualization

### Additional Features
- CSV export
- Currency formatting (INR)
- SQLite database persistence
- Responsive dashboard UI

---

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)

### Utilities
- json2csv
- cors

---

## Project Structure

```text
ExpenseTracker
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── Filters.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── ExpenseChart.jsx
│   │   │   └── CategoryTotals.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
├── backend
│   ├── server.js
│   ├── package.json
│   └── finance_tracker.db
│
└── README.md
```

---

## How to Run Locally

### Clone Repository

```bash
git clone <repository-url>
cd ExpenseTracker
```

### Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```text
http://localhost:3000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Documentation

### Add Expense

**POST**

```http
/api/expenses
```

Request Body:

```json
{
  "amount": 500,
  "category": "Food",
  "note": "Lunch",
  "date": "2026-06-01"
}
```

---

### Get Expenses

**GET**

```http
/api/expenses
```

Optional Query Parameters:

```text
category
startDate
endDate
```

Example:

```http
/api/expenses?category=Food&startDate=2026-06-01&endDate=2026-06-30
```

---

### Update Expense

**PUT**

```http
/api/expenses/:id
```

---

### Delete Expense

**DELETE**

```http
/api/expenses/:id
```

---

### Summary Data

**GET**

```http
/api/summary
```

Response:

```json
{
  "totalSpentThisMonth": 5000,
  "highestExpense": {
    "amount": 2000
  }
}
```

---

### Category Totals

**GET**

```http
/api/category-totals
```

Response:

```json
[
  {
    "category": "Food",
    "total": 2500
  }
]
```

---

### CSV Export

**GET**

```http
/api/export-csv
```

Downloads:

```text
expenses.csv
```

---

## Database

SQLite database is used for storing expenses.

### Expense Fields

| Field | Type |
|---------|---------|
| id | INTEGER |
| amount | REAL |
| category | TEXT |
| note | TEXT |
| date | TEXT |

---

## Future Improvements

- User authentication
- Monthly budgets
- Expense trends dashboard
- Dark mode
- Recurring expenses
- Multi-user support
- Cloud database integration

---

## Author

Akshit Yadav

Full Stack Developer Assessment Project