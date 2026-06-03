
import { useState, useEffect } from "react";
import API from "../services/api";

export default function ExpenseForm({
  editingExpense,
  setEditingExpense,
  refresh
}) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    note: "",
    date: ""
  });

  useEffect(() => {
    if (editingExpense) {
      setForm(editingExpense);
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount) {
      alert("Amount is required");
      return;
    }

    if (Number(form.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (!form.date) {
      alert("Date is required");
      return;
    }

    const selectedDate = new Date(form.date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert(
        "Invalid date. Future dates are not allowed."
      );
      return;
    }

    try {
      if (editingExpense) {
        await API.put(
          `/expenses/${editingExpense.id}`,
          form
        );
      } else {
        await API.post(
          "/expenses",
          form
        );
      }

      setForm({
        amount: "",
        category: "",
        note: "",
        date: ""
      });

      setEditingExpense(null);

      refresh();

    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Something went wrong"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({
            ...form,
            amount: e.target.value
          })
        }
        required
      />

      <select
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value
          })
        }
      >
        <option value="">
          Select Category
        </option>

        <option>Food</option>
        <option>Transport</option>
        <option>Bills</option>
        <option>Entertainment</option>
        <option>Other</option>
      </select>

      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({
            ...form,
            date: e.target.value
          })
        }
        required
      />

      <input
        placeholder="Note"
        value={form.note}
        onChange={(e) =>
          setForm({
            ...form,
            note: e.target.value
          })
        }
      />

      <button>
        {editingExpense
          ? "Update Expense"
          : "Add Expense"}
      </button>

    </form>
  );
}

