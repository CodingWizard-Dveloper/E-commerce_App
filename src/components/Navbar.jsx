import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Menu as BarsIcon, Bell as BellIcon, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Team", href: "/team" },
  { name: "Projects", href: "/projects" },
  { name: "Calendar", href: "/calendar" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <Disclosure as="nav" className="relative bg-gray-200/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-around">
          {/* Mobile menu button */}
          {user && (
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-300/30 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <span className="sr-only">Open main menu</span>
                <BarsIcon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <X
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
          )}

          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex-shrink-0 w-40">
              <img
                alt="Your Company"
                src="/logo.png"
                className="h-full w-auto mix-blend-color-burn"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          {user && (
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-300/30 hover:text-black",
                        "rounded-md px-3 py-2 text-sm font-medium transition"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {/* </div> */}

          {/* Right Section: Notifications + User Menu */}
          {user && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Notifications */}
              <button
                type="button"
                className="relative rounded-full p-1 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt={user?.name || "User avatar"}
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                    className="size-8 rounded-full bg-gray-800"
                  />
                </MenuButton>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black/30 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            active ? "bg-gray-700/50" : "",
                            "block px-4 py-2 text-sm text-gray-200"
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={classNames(
                            active ? "bg-gray-700/50" : "",
                            "block px-4 py-2 text-sm text-gray-200"
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active ? "bg-gray-700/50" : "",
                            "block w-full text-left px-4 py-2 text-sm text-gray-200"
                          )}
                          onClick={() => console.log("Sign out")}
                        >
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-300/30 hover:text-black",
                    "block rounded-md px-3 py-2 text-base font-medium transition"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </DisclosurePanel>
      )}
    </Disclosure>
  );
}
