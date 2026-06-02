import API from "../services/api";

export default function ExpenseTable({
  expenses,
  refresh,
  setEditingExpense,
}) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const deleteExpense = async (id) => {
    if (
      !window.confirm(
        "Delete this expense?"
      )
    )
      return;

    await API.delete(`/expenses/${id}`);
    refresh();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>
              {formatCurrency(
                expense.amount
              )}
            </td>

            <td>
              {expense.category}
            </td>

            <td>{expense.date}</td>

            <td>{expense.note}</td>

            <td>
              <button
                onClick={() =>
                  setEditingExpense(
                    expense
                  )
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteExpense(
                    expense.id
                  )
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}