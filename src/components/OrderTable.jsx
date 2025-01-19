import { useOrders } from "@/store/OrdersContext";
import React, { useState } from "react";

const OrderTable = ({ orders }) => {
  const [loading, setLoading] = useState(false);
  const { deleteOrder, editOrder } = useOrders();
  return (
    <table className="w-full border-collapse my-5">
      <thead>
        <tr>
          <th className="border p-2 text-left bg-gray">ID</th>
          <th className="border p-2 text-left bg-gray">Description</th>
          <th className="border p-2 text-left bg-gray">Count of products</th>
          <th className="border p-2 text-left bg-gray">Created At</th>
          <th className="border p-2 text-left bg-gray">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="border p-2 text-left">{order.id}</td>
            <td className="border p-2 text-left">{order.orderDescription}</td>
            <td className="border p-2 text-left">
              {order.orderproductmap.length}
            </td>
            <td className="border p-2 text-left">
              {new Date(order.createdAt).toLocaleString()}
            </td>
            <td className="border p-2 text-left">
              <button
                className="px-3 py-1 m-1 cursor-pointer border rounded hover:bg-gray-600"
                onClick={() => editOrder(order)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 m-1 cursor-pointer border rounded hover:bg-gray-600"
                onClick={() => {
                  setLoading(true);
                  deleteOrder(order.id);
                }}
                disabled={loading}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
