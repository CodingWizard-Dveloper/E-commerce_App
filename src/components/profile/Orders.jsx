import { Star } from "lucide-react";
import React from "react";

const Orders = () => {
  const recentOrders = [
    {
      id: 1,
      name: "Wireless Earbuds",
      img: "/products/product-1.jpg",
      price: "25.00",
      rating: "4.5",
    },
    {
      id: 2,
      name: "Men’s Watch",
      img: "/products/product-2.jpg",
      price: "45.00",
      rating: "4.2",
    },
  ];
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        Recent Orders
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl bg-gray-50 shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={order.img}
              alt={order.name}
              className="h-40 w-full object-cover rounded-lg"
              loading="lazy"
            />
            <h3 className="mt-4 font-semibold text-gray-900">{order.name}</h3>
            <div className="mt-2 flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-500" /> {order.rating}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="font-bold text-indigo-600">${order.price}</span>
              <button className="text-sm text-indigo-600 font-semibold hover:underline">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
