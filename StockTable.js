import React, { useState, useEffect } from "react";
import { AiOutlineStock } from "react-icons/ai";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function StockTable() {
  const [stockDataFromTable, setStockDataFromTable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stock data from the API
  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/product'); // Ensure this matches your API route
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        setStockDataFromTable(data.products);
      } else {
        console.error('Failed to fetch stock data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load stock data on component mount
  useEffect(() => {
    fetchStockData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container shadow-slate-600 mb-6 mx-auto text-2xl py-10 px-10 lg:py-20 lg:px-32 font-extrabold font-serif rounded-lg shadow-lg">
        <h2 className="text-center mb-8 flex items-center text-3xl justify-center">
          <AiOutlineStock className="mr-2" />
          Stock Information
        </h2>

        {/* Stock Table */}
        <table className="min-w-full bg-white table-auto rounded-lg shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {stockDataFromTable.length > 0 ? (
              stockDataFromTable.map((stock) => (
                <tr key={stock._id} className="text-center border-b">
                  <td className="px-4 py-2">{stock.id}</td>
                  <td className="px-4 py-2">{stock.name}</td>
                  <td className="px-4 py-2">${stock.price.toFixed(2)}</td>
                  <td
                    className={`px-4 py-2 flex items-center justify-center ${
                      stock.change.includes("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stock.change.includes("+") ? (
                      <FaArrowUp className="mr-1" />
                    ) : (
                      <FaArrowDown className="mr-1" />
                    )}
                    {stock.change}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No stock found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
