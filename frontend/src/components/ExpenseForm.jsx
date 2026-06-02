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

    if (editingExpense) {
      await API.put(
        `/expenses/${editingExpense.id}`,
        form
      );
    } else {
      await API.post("/expenses", form);
    }

    setForm({
      amount: "",
      category: "",
      note: "",
      date: ""
    });

    setEditingExpense(null);
    refresh();
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