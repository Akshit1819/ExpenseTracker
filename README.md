# Mini Expense Tracker

## Project Title & Brief Description

**Mini Expense Tracker** is a full-stack expense management application built as a Full Stack Developer assessment project. The application allows users to track daily expenses, categorize spending, filter records by category and date range, export data to CSV, and visualize spending through interactive charts. To enhance the user experience, additional features such as JWT-based authentication, category budget management, and budget progress indicators have also been implemented.

---

## Live Demo Links

### Frontend

https://expense-tracker-mu-pink-20.vercel.app

### Backend API

https://expensetracker-i0yo.onrender.com

---

## Tech Stack

### Frontend

* **React.js** – Component-based UI development.
* **Vite** – Fast build tool and development server.
* **Axios** – API communication.
* **Recharts** – Expense analytics and chart visualization.
* **CSS3** – Responsive UI styling.

### Backend

* **Node.js** – JavaScript runtime.
* **Express.js** – REST API framework.
* **SQLite (better-sqlite3)** – Lightweight relational database.
* **JWT (jsonwebtoken)** – User authentication and authorization.
* **bcryptjs** – Password hashing.
* **cors** – Cross-origin request handling.
* **json2csv** – CSV export generation.

### Deployment

* **Vercel** – Frontend hosting.
* **Render** – Backend hosting.

---

## Features

### Expense Management

* Add new expenses
* Edit existing expenses
* Delete expenses
* Category validation
* Date validation
* Future date prevention
* Optional notes

### Filtering

* Filter by category
* Filter by date range

### Analytics

* Total expenses for the current month
* Highest expense tracking
* Category-wise expense totals
* Pie chart visualization

### Budget Tracking

* Category-wise budgets
* Editable budget settings
* Budget utilization percentage
* Visual progress indicators
* Over-budget alerts

### Additional Features

* JWT Authentication
* User Registration & Login
* CSV Export
* SQLite Database Persistence
* Responsive Dashboard UI

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

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

### Environment Variables

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## API Documentation

### Authentication

#### Register User

**POST**

```http
/api/auth/register
```

Request Body:

```json
{
  "name": "Akshit",
  "email": "akshit@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "User registered successfully"
}
```

---

#### Login User

**POST**

```http
/api/auth/login
```

Request Body:

```json
{
  "email": "akshit@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "jwt_token"
}
```

---

### Expenses

#### Add Expense

**POST**

```http
/api/expenses
```

Headers:

```http
Authorization: Bearer <token>
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

Response:

```json
{
  "message": "Expense added successfully"
}
```

---

#### Get Expenses

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

#### Update Expense

**PUT**

```http
/api/expenses/:id
```

---

#### Delete Expense

**DELETE**

```http
/api/expenses/:id
```

---

### Analytics

#### Monthly Summary

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

#### Category Totals

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

### Budget Management

#### Get Budgets

**GET**

```http
/api/budgets
```

Response:

```json
[
  {
    "category": "Food",
    "limit_amount": 5000
  }
]
```

---

#### Update Budget

**PUT**

```http
/api/budgets/:category
```

Request Body:

```json
{
  "limit_amount": 6000
}
```

Response:

```json
{
  "message": "Budget updated successfully"
}
```

---

### CSV Export

#### Export Expenses

**GET**

```http
/api/export-csv
```

Downloads:

```text
expenses.csv
```

---

## Project Structure

```text
ExpenseTracker
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── Filters.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── ExpenseChart.jsx
│   │   │   ├── CategoryTotals.jsx
│   │   │   └── BudgetSettings.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
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
│   ├── finance_tracker.db
│   └── package.json
│
└── README.md
```

### Folder Overview

* **frontend/components** – Reusable UI components.
* **frontend/pages** – Authentication pages.
* **frontend/services** – API communication layer.
* **backend/server.js** – Express server and REST APIs.
* **finance_tracker.db** – SQLite database.
* **README.md** – Project documentation.

---

## Next Steps

Given more time, the following improvements could be added:


* Email verification
* Password reset functionality
* Budget notifications and alerts
* Multi-currency support
* User profile management
* Advanced analytics dashboard
* Cloud-hosted database (PostgreSQL/MySQL)
* Automated testing (Jest, React Testing Library)
* Docker support and CI/CD pipeline

### Additional Enhancements Implemented

The original assessment focused on a single-user expense tracker. The following enhancements were implemented beyond the core requirements:

* JWT-based Authentication
* User Registration and Login
* Category Budget Management
* Budget Progress Indicators
* Over-Budget Tracking
* Secure Protected API Routes

---

## Author

**Akshit Yadav**

Mini Expense Tracker – Full Stack Developer Assessment Project
