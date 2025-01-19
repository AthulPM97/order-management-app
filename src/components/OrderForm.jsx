import { useState, useEffect } from "react";
import { useProducts } from "@/store/ProductsContext";
import { useOrders } from "@/store/OrdersContext";

export default function OrderForm() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderDescription, setOrderDescription] = useState("");

  const { products } = useProducts();
  const { addOrder } = useOrders();

  // Handle product selection
  const handleCheckboxChange = (productId) => {
    setSelectedProducts(
      (prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId) // Remove if already selected
          : [...prev, productId] // Add if not selected
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      orderDescription,
      products: selectedProducts,
    };
    try {
      await addOrder(orderData);
      alert("Order submitted successfully!");
      // Reset the form
      setOrderDescription("");
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit the order.");
    }
  };

  return (
    <div className="max-w-lg mx-auto border p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">New Order</h2>
      <form onSubmit={handleSubmit}>
        {/* Order Description */}
        <input
          type="text"
          placeholder="Order Description"
          value={orderDescription}
          onChange={(e) => setOrderDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* Product List */}
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center p-2 border rounded"
            >
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleCheckboxChange(product.id)}
                className="mr-2"
              />
              <div>
                <p className="font-bold text-green-700">
                  {product.productName}
                </p>
                <p className="text-sm text-gray-600">
                  {product.productDescription}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300"
            onClick={() => {
              setOrderDescription("");
              setSelectedProducts([]);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
