import { useState, useEffect } from "react";
import { useProducts } from "@/store/ProductsContext";
import { useOrders } from "@/store/OrdersContext";

export default function OrderForm({ handleCloseModal }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderDescription, setOrderDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { products } = useProducts();
  const { addOrder, updateOrder, editOrder, editingOrder } = useOrders();

  // Prefill form when editingOrder changes
  useEffect(() => {
    if (editingOrder) {
      const productIds = editingOrder.orderproductmap.map(
        (item) => item.productId
      );
      setOrderDescription(editingOrder.orderDescription);
      setSelectedProducts(productIds || []); // array of product IDs
    }
  }, [editingOrder]);

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
    setIsLoading(true);

    const orderData = {
      orderDescription,
      products: selectedProducts,
    };
    try {
      if (editingOrder) {
        // Update existing order
        await updateOrder(editingOrder.id, orderData);
        alert("Order updated successfully!");
      } else {
        // Add new order
        await addOrder(orderData);
        alert("Order submitted successfully!");
      }
      // Reset the form
      setOrderDescription("");
      setSelectedProducts([]);
      setIsLoading(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting order:", error);
      handleCloseModal();
      alert("Failed to submit the order.");
    }
  };

  return (
    <div className="max-w-lg mx-auto border p-4 rounded shadow">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {" "}
          {editingOrder ? "Edit Order" : "New Order"}
        </h2>
        {/* Cart Icon with Product Count */}
        <div className="flex items-center space-x-2 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 5.4M19 13l1.35 5.4M7 18h10"
            />
          </svg>
          <span className="text-sm font-semibold">
            {selectedProducts.length}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Order Description */}
        <input
          type="text"
          placeholder="Order Description"
          value={orderDescription}
          onChange={(e) => setOrderDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-gray-800"
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
              editOrder(null);
              setOrderDescription("");
              setSelectedProducts([]);
              handleCloseModal();
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : editingOrder ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
