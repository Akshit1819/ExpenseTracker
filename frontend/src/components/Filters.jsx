import { useState } from "react";
import API from "../services/api";

export default function Filters({
  setExpenses,
}) {
  const [category, setCategory] =
    useState("");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [endDate, setEndDate] =
    useState("");

  const applyFilter =
    async () => {
      const res =
        await API.get(
          `/expenses?category=${category}&startDate=${startDate}&endDate=${endDate}`
        );

      setExpenses(res.data);
    };

  return (
    <div className="filters">
      <select
        value={category}
        onChange={(e) =>
          setCategory(
            e.target.value
          )
        }
      >
        <option value="">
          All Categories
        </option>

        <option>Food</option>
        <option>Transport</option>
        <option>Bills</option>
        <option>
          Entertainment
        </option>
        <option>Other</option>
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(
            e.target.value
          )
        }
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(
            e.target.value
          )
        }
      />

      <button
        onClick={applyFilter}
      >
        Apply Filter
      </button>
    </div>
  );
}