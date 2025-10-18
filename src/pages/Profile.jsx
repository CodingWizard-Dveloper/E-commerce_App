import { useEffect, useState } from "react";
import { User2Icon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Orders from "../components/profile/Orders";
import Wishlist from "../components/profile/Wishlist";
import Settings from "../components/profile/Settings";
import ManageStore from "../components/profile/ManageStore";

export default function Profile() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab");
  const [activeTab, setActiveTab] = useState(tab ?? "orders");
  const { user: defaultUser } = useSelector((state) => state.auth);

  const formattedDate = new Date(defaultUser?.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const userTabs = [
    { id: "orders", label: "Orders", component: (key) => <Orders key={key} /> },
    {
      id: "wishlist",
      label: "Wishlist",
      component: (key) => <Wishlist key={key} />,
    },
    {
      id: "settings",
      label: "Settings",
      component: (key) => <Settings key={key} />,
    },
  ];

  if (defaultUser?.storeId) {
    userTabs.splice(2, 0, {
      id: "ManageStore",
      label: "Manage store",
      component: (key) => <ManageStore key={key} />,
    });
  }

  useEffect(() => {
    const validTabs = userTabs.map((t) => t.id);
    if (!validTabs.includes(tab)) {
      setParams({ tab: "orders" });
    }
    // eslint-disable-next-line
  }, [tab, userTabs]);

  return (
    <div className="bg-gray-100/50 min-h-screen">
      {/* Profile Header - Display Only */}
      <section className="relative bg-gray-200/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row gap-6 items-center">
          {/* Avatar - Display Only */}
          <div className="w-28 h-28">
            {defaultUser?.avatar ? (
              <img
                src={defaultUser.avatar || "/profile/default-avatar.png"}
                className="h-28 w-28 rounded-full object-cover border-4 border-indigo-600 shadow"
                loading="lazy"
              />
            ) : (
              <User2Icon
                className="rounded-full object-cover border-4 border-indigo-600 shadow inline-block"
                color="#4f39f6"
                size={"112px"}
              />
            )}
          </div>

          {/* User Info - Display Only */}
          <div className="flex flex-col gap-3 items-center sm:items-start">
            <h1 className="text-2xl font-bold text-gray-800">
              {defaultUser?.userName || "User"}
            </h1>
            <p className="text-lg text-gray-600">
              {defaultUser?.email || "email@example.com"}
            </p>
            <p className="text-sm text-gray-500">Joined {formattedDate}</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl mt-6 flex">
        <div className="flex space-x-2 border-b w-full">
          {userTabs.map((tab) => (
            <Link to={`/profile/?tab=${tab.id}`} key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-t-lg font-semibold transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-indigo-600 shadow border border-b-0"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="mx-auto max-w-7xl px-6 py-6 bg-white shadow rounded-b-lg">
        {userTabs?.map(
          (tab) => tab?.id === activeTab && tab?.component(tab?.id)
        )}
      </section>
    </div>
  );
}
