export default function SummaryCards({
  summary
}) {
  const formatCurrency = (
    amount
  ) =>
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR"
      }
    ).format(amount || 0);

  return (
    <div className="cards">
      <div className="card">
        <h3>Total This Month</h3>

        <p>
          {formatCurrency(
            summary.totalSpentThisMonth
          )}
        </p>
      </div>

      <div className="card">
        <h3>Highest Expense</h3>

        <p>
          {formatCurrency(
            summary.highestExpense
              ?.amount
          )}
        </p>
      </div>
    </div>
  );
}