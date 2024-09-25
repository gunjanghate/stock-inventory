import React, { useState, useEffect } from "react";
import { AiOutlineStock } from "react-icons/ai";
import { FaArrowUp, FaArrowDown, FaSpinner, FaTrash } from "react-icons/fa";

export default function Home() {
  const [stockData, setStockData] = useState([]);
  const [newStock, setNewStock] = useState({
    name: "",
    price: "",
    change: "",
  });
  const [donemsg, setDonemsg] = useState(""); // For pop-up message
  const [alertMsg, setAlertMsg] = useState(""); // For pop-up message
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAddStock = async() => {
    if (newStock.name && newStock.price && newStock.change) {
      const stockToAdd = {
        id: (stockData?.length || 0) + 1, // Consider a more robust ID generation
        name: newStock.name,
        price: parseFloat(newStock.price),
        change: newStock.change, // Parse change as a float
      };
      try {
        // Send a POST request to add the new stock to the database
        const response = await fetch('/api/product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stockToAdd),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add stock');
        }
  
      // Update state with the new stock data
      const updatedStockData = [...stockData, stockToAdd];
      setStockData(updatedStockData);
  
      setDonemsg("Stock added successfully!");
  
      // Clear the alert message after 5 seconds
      setTimeout(() => {
        setDonemsg(""); // Reset alert message after 5 seconds
      }, 5000);
  
      setNewStock({ name: "", price: "", change: "" });
    }catch (error) {
    console.error("Error adding stock:", error);
    alert("Error adding stock: " + error.message);
  }
}
    else {
      alert("Please fill all details");
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/product'); // Ensure this matches your API route
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        setStockData(data.products);
      } else {
        console.error('Failed to fetch stock data');
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (id) => {
    console.log("Deleting stock with ID:", id); // Log the id
  
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Ensure that you're sending the id correctly
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setAlertMsg("Stock Removed successfully!");
      setTimeout(() => {
        setAlertMsg(""); 
      }, 3000);
      const data = await response.json();
      console.log("Stock deleted:", data);
  
      // Remove the deleted stock from the state
      setStockData(stockData.filter((stock) => stock._id !== id));
    } catch (error) {
      console.error("Error deleting stock:", error.message);
    }
  };
  
  
  
  

  useEffect(() => {
    fetchStockData();
  }, []);

  const filteredStockData = stockData.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center font-bold font-sans mt-10 flex justify-center ">
        <FaSpinner className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div>
      {donemsg && (
        <div className="bg-green-500 text-white text-center font-sans rounded-md shadow-md shadow-green-200 font-bold w-fit px-2 py-2 ml-4 fixed transition-all translate-y-4  duration-300 ease-in-out opacity-100">
          {donemsg}
        </div>
      )}
      {alertMsg && (
        <div className="bg-red-500 text-white text-center font-sans rounded-md shadow-md shadow-red-200 font-bold w-fit px-2 py-2 ml-4 fixed transition-all translate-y-4  duration-300 ease-in-out opacity-100">
          {alertMsg}
        </div>
      )}

      <div className="container shadow-slate-600 mb-6 mx-auto text-2xl py-10 px-10 lg:py-20 lg:px-32 font-extrabold font-serif rounded-lg shadow-lg">
        <h2 className="text-center mb-8 flex items-center text-3xl justify-center">
          <AiOutlineStock className="mr-2" />
          Stock Information
        </h2>

        {/* Search Bar */}
        <div className="mb-6 rounded-lg shadow-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by stock name or symbol"
            className="p-2 w-full border rounded-lg"
          />
        </div>

        {/* Add Stock Form */}
        <div className="mb-10 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-xl mb-4">Add New Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              value={newStock.name}
              onChange={handleInputChange}
              placeholder="Stock Name"
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="price"
              value={newStock.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="change"
              value={newStock.change}
              onChange={handleInputChange}
              placeholder="Change (e.g., +1.2%)"
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddStock}
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Stock
          </button>
        </div>

        {/* Stock Table */}
        <table className="min-w-full bg-white table-auto rounded-lg shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Change</th>
              <th className="px-4 py-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockData.length > 0 ? (
              filteredStockData.map((stock) => (
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
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                      onClick={() => handleDeleteStock(stock._id)}
                    >
                      <FaTrash />
                    </button>
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
