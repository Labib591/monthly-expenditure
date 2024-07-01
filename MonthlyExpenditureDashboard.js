import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyExpenditureDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  const saveExpenses = () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    setMessage('Expenses saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const addExpense = () => {
    if (newCategory && newAmount && selectedDate) {
      const updatedExpenses = [...expenses, { 
        category: newCategory, 
        amount: parseFloat(newAmount),
        date: selectedDate
      }];
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      setNewCategory('');
      setNewAmount('');
      setMessage('Expense added and saved!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getMonthlyData = () => {
    const monthlyExpenses = expenses.filter(expense => expense.date.startsWith(selectedMonth));
    const categories = [...new Set(monthlyExpenses.map(expense => expense.category))];
    return categories.map(category => ({
      category,
      amount: monthlyExpenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
    }));
  };

  const monthlyData = getMonthlyData();
  const totalMonthlyExpenses = monthlyData.reduce((sum, expense) => sum + expense.amount, 0);

  const months = [...new Set(expenses.map(expense => expense.date.slice(0, 7)))].sort();

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Monthly Expenditure Dashboard</h1>
      
      {message && (
        <div style={{ padding: '1rem', backgroundColor: '#e6f7ff', borderRadius: '4px', marginBottom: '1rem' }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Add New Expense</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ flexGrow: 1, padding: '0.5rem' }}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            style={{ flexGrow: 1, padding: '0.5rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ flexGrow: 1, padding: '0.5rem' }}
          />
          <button onClick={addExpense} style={{ padding: '0.5rem 1rem', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px' }}>Add</button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Select Month to View</h2>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Monthly Expense Breakdown for {selectedMonth}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Expenses for {selectedMonth}</h2>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${totalMonthlyExpenses.toFixed(2)}</p>
      </div>

      <button 
        onClick={saveExpenses} 
        style={{ width: '100%', padding: '0.5rem 1rem', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Save All Expenses
      </button>
    </div>
  );
};

export default MonthlyExpenditureDashboard;