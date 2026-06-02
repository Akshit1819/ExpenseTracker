
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import API from "./services/api";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import Filters from "./components/Filters";
import SummaryCards from "./components/SummaryCards";
import ExpenseChart from "./components/ExpenseChart";
import CategoryTotals from "./components/CategoryTotals";


function Dashboard() {

  const navigate = useNavigate();

  const [expenses, setExpenses] =
    useState([]);

  const [summary, setSummary] =
    useState({});

  const [chartData, setChartData] =
    useState([]);

  const [categoryTotals,
    setCategoryTotals] =
    useState([]);

  const [editingExpense,
    setEditingExpense] =
    useState(null);

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  const exportCSV = async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

     const response =await fetch(
    `${API.defaults.baseURL}/export-csv`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;
      a.download =
        "expenses.csv";

      document.body.appendChild(
        a
      );

      a.click();

      document.body.removeChild(
        a
      );

      window.URL.revokeObjectURL(
        url
      );

    } catch (error) {

      console.error(
        "CSV Export Failed:",
        error
      );

      alert(
        "Failed to export CSV"
      );
    }
  };

  const loadExpenses =
    async () => {

      const res =
        await API.get(
          "/expenses"
        );

      setExpenses(
        res.data
      );
    };

  const loadSummary =
    async () => {

      const res =
        await API.get(
          "/summary"
        );

      setSummary(
        res.data
      );
    };

  const loadChartData =
    async () => {

      const res =
        await API.get(
          "/category-totals"
        );

      setChartData(
        res.data
      );
    };

  const loadCategoryTotals =
    async () => {

      const res =
        await API.get(
          "/category-totals"
        );

      setCategoryTotals(
        res.data
      );
    };

  const refreshData = () => {

    loadExpenses();
    loadSummary();
    loadChartData();
    loadCategoryTotals();
  };

  useEffect(() => {

    refreshData();

  }, []);

  return (
    <div className="container">

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "20px"
        }}
      >
        <h1>
          💰 Personal Finance Tracker
        </h1>

        <button
          onClick={logout}
        >
          Logout
        </button>

      </div>

      <SummaryCards
        summary={summary}
      />

      {/* CSV EXPORT */}

      <div
        className="export-section"
      >
        <button
          onClick={exportCSV}
        >
          📥 Export CSV
        </button>
      </div>

      <div className="analytics-section">

        <div className="analytics-item">
          <ExpenseChart
            data={chartData}
          />
        </div>

        <div className="analytics-item">
          <CategoryTotals
            data={categoryTotals}
          />
        </div>

      </div>

      <ExpenseForm
        editingExpense={
          editingExpense
        }
        setEditingExpense={
          setEditingExpense
        }
        refresh={
          refreshData
        }
      />

      <Filters
        setExpenses={
          setExpenses
        }
      />

      <ExpenseTable
        expenses={expenses}
        setEditingExpense={
          setEditingExpense
        }
        refresh={
          refreshData
        }
      />

    </div>
  );
}



function ProtectedRoute({
  children
}) {

  const token =
    localStorage.getItem(
      "token"
    );

  return token
    ? children
    : (
      <Navigate
        to="/login"
      />
    );
}

function App() {

  return (
    <Routes>

      <Route
        path="/login"
        element={
          <Login />
        }
      />

      <Route
        path="/signup"
        element={
          <Signup />
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          localStorage.getItem(
            "token"
          )
            ? (
              <Navigate
                to="/dashboard"
              />
            )
            : (
              <Navigate
                to="/login"
              />
            )
        }
      />

    </Routes>
  );
}

export default App;

