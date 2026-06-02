export default function CategoryTotals({
  data
}) {
  return (
    <div className="card">
      <h3>Category Totals</h3>

      {data.length === 0 && (
        <p>No expenses found</p>
      )}

      {data.map((item) => (
        <p key={item.category}>
          <strong>
            {item.category}
          </strong>
          :{" "}
          {new Intl.NumberFormat(
            "en-IN",
            {
              style: "currency",
              currency: "INR"
            }
          ).format(item.total)}
        </p>
      ))}
    </div>
  );
}