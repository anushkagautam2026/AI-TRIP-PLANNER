import React, { useState, useMemo } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

function SplitwiseTab({ trip, tripId }) {
  const members = trip.members || [];
  const expenses = trip.expenses || [];

  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [sharedWith, setSharedWith] = useState([]);

  const handleCheckboxChange = (member) => {
    setSharedWith((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const handleAddExpense = async () => {
    if (!payer || !amount || !sharedWith.length) {
      alert("Fill all fields");
      return;
    }

    const expense = {
      payer,
      amount: parseFloat(amount),
      description,
      sharedWith,
      timestamp: Date.now(),
    };

    try {
      const tripRef = doc(db, "AITrips", tripId);
      await updateDoc(tripRef, {
        expenses: arrayUnion(expense),
      });
      alert("Expense added! Refresh to see changes.");
      setAmount("");
      setPayer("");
      setDescription("");
      setSharedWith([]);
    } catch (e) {
      console.error("Failed to add expense", e);
    }
  };

  // Balance calculation logic
  const balances = useMemo(() => {
    const summary = {};
    members.forEach((m) => (summary[m] = { balance: 0, toPay: [] }));

    expenses.forEach((exp) => {
      const share = exp.amount / exp.sharedWith.length;
      exp.sharedWith.forEach((member) => {
        if (member !== exp.payer) {
          summary[member].balance -= share;
          summary[member].toPay.push(exp);
        }
      });
      summary[exp.payer].balance += exp.amount - share * exp.sharedWith.length;
    });

    return summary;
  }, [expenses, members]);

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>

      <input
        type="text"
        placeholder="Description"
        className="w-full mb-2 p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full mb-2 p-2 rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

{/* Payer dropdown (single select) */}
<select
  className="w-full mb-4 p-2 rounded border"
  value={payer}
  onChange={(e) => setPayer(e.target.value)}
>
  <option value="">Select payer</option>
  {members.map((member) => (
    <option key={member} value={member}>
      {member}
    </option>
  ))}
</select>

{/* SharedWith dropdown (multi-select) */}
<div className="mb-4">
  <label className="font-semibold block mb-1">Shared With:</label>
  <select
    multiple
    className="w-full p-2 rounded border"
    value={sharedWith}
    onChange={(e) =>
      setSharedWith(
        Array.from(e.target.selectedOptions, (option) => option.value)
      )
    }
  >
    {members.map((member) => (
      <option key={member} value={member}>
        {member}
      </option>
    ))}
  </select>
</div>


      <button
        onClick={handleAddExpense}
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
      >
        Add Expense
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-4">Balances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div key={member} className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold">{member}</h3>
            <p className="mb-2">
              <strong>Balance:</strong>{" "}
              <span
                className={`font-bold ${
                  balances[member].balance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{balances[member].balance.toFixed(2)}
              </span>
            </p>

            <h4 className="font-semibold">Owes for:</h4>
            <ul className="list-disc pl-4">
              {balances[member].toPay.map((exp, idx) => (
                <li key={idx}>
                  {exp.description} (₹
                  {(exp.amount / exp.sharedWith.length).toFixed(2)} to{" "}
                  {exp.payer})
                </li>
              ))}
              {balances[member].toPay.length === 0 && (
                <li className="text-gray-500">No pending payments</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SplitwiseTab;
