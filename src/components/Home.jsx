"use client";
import OrderForm from "@/components/OrderForm";
import OrderTable from "@/components/OrderTable";
import { useOrders } from "@/store/OrdersContext";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { orders, editOrder } = useOrders();

  const filteredOrders = orders.filter(
    (order) =>
      (order &&
        order.orderDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      String(order.id).includes(searchQuery)
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start font-sans p-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight text-center sm:text-left mb-6">
          Order management
        </h1>
        <div className="flex items-center justify-between w-full mb-6">
          {/* Search Input */}
          <input
            type="text"
            className="w-full max-w-md p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by ID or Description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Open Modal Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            onClick={() => {
              editOrder(null);
              handleOpenModal();
            }}
          >
            Add New Order
          </button>
        </div>
        <OrderTable handleOpenModal={handleOpenModal} orders={filteredOrders} />
      </main>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg max-w-md w-full relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={handleCloseModal}
            >
              ✖
            </button>
            {/* Order Form */}
            <OrderForm handleCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}
