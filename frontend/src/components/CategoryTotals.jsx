```jsx
export default function CategoryTotals({
  data
}) {

  const budgets = {
    Food: 5000,
    Transport: 2000,
    Bills: 3000,
    Entertainment: 4000,
    Other: 2000
  };

  return (
    <div className="card">
      <h3>Category Totals</h3>

      {data.length === 0 && (
        <p>No expenses found</p>
      )}

      {data.map((item) => {

        const budget =
          budgets[item.category] || 0;

        const overBudget =
          item.total > budget;

        return (
          <div
            key={item.category}
            style={{
              marginBottom: "12px"
            }}
          >
            <p>
              <strong>
                {item.category}
              </strong>
            </p>

            <p>
              Spent:
              {" "}
              {new Intl.NumberFormat(
                "en-IN",
                {
                  style: "currency",
                  currency: "INR"
                }
              ).format(item.total)}
            </p>

            <p>
              Budget:
              {" "}
              {new Intl.NumberFormat(
                "en-IN",
                {
                  style: "currency",
                  currency: "INR"
                }
              ).format(budget)}
            </p>

            <p
              style={{
                color: overBudget
                  ? "red"
                  : "green",
                fontWeight: "bold"
              }}
            >
              {overBudget
                ? "🔴 Over Budget"
                : "🟢 Within Budget"}
            </p>

            <hr />
          </div>
        );
      })}
    </div>
  );
}
```
