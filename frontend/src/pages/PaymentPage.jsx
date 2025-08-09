import { useParams } from 'react-router-dom';
import { useState } from 'react';

const PaymentPage = () => {
  const { id } = useParams();
  const [method, setMethod] = useState('');
  const [form, setForm] = useState({ email: '', password: '', cardNumber: '', cardExpiry: '', cardCVC: '', bankAccount: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You selected ${method} for application ID: ${id}\nDetails: ${JSON.stringify(form, null, 2)}`);
    // Here you would handle the payment logic
  };

  return (
    <div className="container bg-white rounded shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Visa Application Payment</h1>
      <p>Proceed with payment for application ID: <strong>{id}</strong></p>
      <form onSubmit={handleSubmit} className="mt-6">
        <label className="block mb-2 font-semibold">Choose payment method:</label>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="" disabled>Select a method</option>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>

        {/* Credit Card Fields */}
        {method === 'credit_card' && (
          <>
            <input
              type="text"
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={e => setForm({ ...form, cardNumber: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={form.cardExpiry}
              onChange={e => setForm({ ...form, cardExpiry: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="CVC"
              value={form.cardCVC}
              onChange={e => setForm({ ...form, cardCVC: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
            />
          </>
        )}

        {/* PayPal Fields */}
        {method === 'paypal' && (
          <>
            <input
              type="email"
              placeholder="PayPal Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="PayPal Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
            />
          </>
        )}

        {/* Bank Transfer Fields */}
        {method === 'bank_transfer' && (
          <>
            <input
              type="text"
              placeholder="Bank Account Number"
              value={form.bankAccount}
              onChange={e => setForm({ ...form, bankAccount: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Proceed to Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;