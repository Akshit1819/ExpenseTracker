export default function CategoryTotals({
  data,
  budgets = []
}) {

  const getBudget = (
    category
  ) => {

    const budget =
      budgets.find(
        (b) =>
          b.category ===
          category
      );

    return budget
      ? Number(
          budget.limit_amount
        )
      : 0;
  };

  return (
    <div className="card">

      <h3>
        Category Budgets
      </h3>

      {data.length === 0 && (
        <p>
          No expenses found
        </p>
      )}

      {data.map((item) => {

        const budget =
          getBudget(
            item.category
          );

        const spent =
          Number(
            item.total
          );

        const percentage =
          budget > 0
            ? (
                spent /
                budget
              ) * 100
            : 0;

        const overBudget =
          spent > budget;

        return (

          <div
            key={
              item.category
            }
            style={{
              marginBottom:
                "20px"
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between"
              }}
            >

              <strong>
                {
                  item.category
                }
              </strong>

              <span>
                ₹{spent}
                {" / "}
                ₹{budget}
              </span>

            </div>

            <div
              className="budget-bar"
            >

              <div
                className={
                  overBudget
                    ? "budget-fill-over"
                    : "budget-fill"
                }
                style={{
                  width:
                    `${Math.min(
                      percentage,
                      100
                    )}%`
                }}
              />

            </div>

            <p
              style={{
                marginTop:
                  "5px"
              }}
            >

              {percentage.toFixed(
                0
              )}
              % Used

            </p>

            <p
              style={{
                color:
                  overBudget
                    ? "red"
                    : "green",
                fontWeight:
                  "bold"
              }}
            >

              {overBudget
                ? "🔴 Over Budget"
                : "🟢 Within Budget"}

            </p>

          </div>

        );
      })}

    </div>
  );
}