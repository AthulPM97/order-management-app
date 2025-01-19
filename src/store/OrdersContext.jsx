"use client";
import { createContext, useContext, useState, useEffect } from "react";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

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

  const ordersCtx = {
    orders,
    addOrder,
  };

  return (
    <OrdersContext.Provider value={ordersCtx}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
