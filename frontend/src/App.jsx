import { useEffect, useState } from "react";
import API from "./services/api";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import Filters from "./components/Filters";
import SummaryCards from "./components/SummaryCards";
import ExpenseChart from "./components/ExpenseChart";
import CategoryTotals from "./components/CategoryTotals";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [categoryTotals, setCategoryTotals] =
    useState([]);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const loadExpenses = async () => {
    const res = await API.get(
      "/expenses"
    );

    setExpenses(res.data);
  };

  const loadSummary = async () => {
    const res = await API.get(
      "/summary"
    );

    setSummary(res.data);
  };

  const loadChartData = async () => {
    const res = await API.get(
      "/category-totals"
    );

    setChartData(res.data);
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
      <h1>
        💰 Personal Finance Tracker
      </h1>

      {/* Summary Cards */}
      <SummaryCards
        summary={summary}
      />

      {/* Chart + Totals */}
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

      {/* CSV Export */}
      <div className="export-section">
        <a
          href="http://localhost:3000/api/export-csv"
          target="_blank"
          rel="noreferrer"
        >
          <button>
            Export CSV
          </button>
        </a>
      </div>

      {/* Expense Form */}
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

      {/* Filters */}
      <Filters
        setExpenses={
          setExpenses
        }
      />

      {/* Table */}
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

export default App;