
import { useEffect, useState } from "react";
import API from "../services/api";

export default function BudgetSettings({
  refresh
}) {

  const [budgets,
    setBudgets] =
    useState([]);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets =
    async () => {

      const res =
        await API.get(
          "/budgets"
        );
console.log("BUDGET API RESPONSE:", res.data);
      setBudgets(
        res.data
      );
    };

  const updateBudget =
    async (
      category,
      amount
    ) => {

      await API.put(
        `/budgets/${category}`,
        {
          limit_amount:
            amount
        }
      );

      refresh();

      alert(
        `${category} budget updated`
      );
    };

  return (
    <div className="card">

      <h3>
        Budget Settings
      </h3>

      {budgets.map(
        (budget) => (

          <div
            key={
              budget.category
            }
            style={{
              marginBottom:
                "12px"
            }}
          >

            <label>
              {
                budget.category
              }
            </label>

            <div
              style={{
                display:
                  "flex",
                gap:
                  "10px",
                marginTop:
                  "5px"
              }}
            >

              <input
                type="number"
                value={
                  budget.limit_amount
                }
                onChange={
                  (e) => {

                    setBudgets(
                      budgets.map(
                        (b) =>
                          b.category ===
                          budget.category
                            ? {
                                ...b,
                                limit_amount:
                                  e
                                    .target
                                    .value
                              }
                            : b
                      )
                    );

                  }
                }
              />

              <button
                onClick={() =>
                  updateBudget(
                    budget.category,
                    budget.limit_amount
                  )
                }
              >
                Save
              </button>

            </div>

          </div>

        )
      )}

    </div>
  );
}

