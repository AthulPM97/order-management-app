"use client";
import { createContext, useContext, useState, useEffect } from "react";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null); // Keep track of the order being edited

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  const addOrder = async (order) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const newOrder = await res.json();

      setOrders((prev) => {
        // Create a map to avoid duplicates
        const ordersMap = new Map(prev.map((o) => [o.id, o]));
        newOrder.forEach((o) => ordersMap.set(o.id, o)); // Add/update new orders
        return Array.from(ordersMap.values());
      });
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const updateOrder = async (orderId, updatedOrder) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data : o)));
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const editOrder = (order) => setEditingOrder(order); // Set the editing order

  const ordersCtx = {
    orders,
    addOrder,
    deleteOrder,
    editOrder,
    editingOrder,
    updateOrder,
  };

  return (
    <OrdersContext.Provider value={ordersCtx}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
