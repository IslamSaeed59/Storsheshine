import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Users,
  ShoppingBagIcon,
  ChevronDown,
  Store,
  ChartNoAxesGantt,
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ onClose }) => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const navLinkClasses =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 font-medium text-xl transition-all duration-200 hover:bg-[#cc1f69] hover:text-white";
  const activeNavLinkClasses = "bg-[#cc1f69] text-white";

  return (
    <div className="flex min-h-screen w-64 flex-col bg-white shadow-lg ">
      <div className="flex items-center justify-center p-6">
        <Link
          to="/admin"
          className="text-3xl font-bold"
          style={{ color: "#cc1f69" }}
        >
          SheShine
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {/* Store  */}
        <NavLink
          onClick={onClose}
          to="/"
          className={({ isActive }) =>
            `${navLinkClasses} ${
              isActive ? activeNavLinkClasses : ""
            } font-semibold`
          }
        >
          <Store className="h-5 w-5" />
          Store
        </NavLink>
        {/* <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${navLinkClasses} ${
              isActive ? activeNavLinkClasses : ""
            } font-semibold`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink> */}

        {/* Category */}
        <NavLink
          onClick={onClose}
          to="/admin/category"
          className={({ isActive }) =>
            `${navLinkClasses} ${
              isActive ? activeNavLinkClasses : ""
            } font-semibold`
          }
        >
          <ChartNoAxesGantt className="h-5 w-5" />
          Category
        </NavLink>

        <NavLink
          onClick={onClose}
          to="/admin/products"
          className={({ isActive }) =>
            `${navLinkClasses} ${
              isActive ? activeNavLinkClasses : ""
            } font-semibold`
          }
        >
          <ShoppingBag className="h-5 w-5" />
          Products
        </NavLink>

        <NavLink
          onClick={onClose}
          to="/admin/users"
          className={({ isActive }) =>
            `${navLinkClasses} ${
              isActive ? activeNavLinkClasses : ""
            } font-semibold`
          }
        >
          <Users className="h-5 w-5" />
          Users
        </NavLink>

        <div className="space-y-2">
          {/* Parent Link */}
          <div className="flex items-center justify-between">
            {/* NavLink part */}
            {/* <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `${navLinkClasses} flex-1 font-semibold ${
                  isActive ? activeNavLinkClasses : ""
                }`
              }
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Orders</span>
            </NavLink> */}

            {/* Arrow button (toggles submenu) */}
            {/* <button
              onClick={() => setIsOrdersOpen(!isOrdersOpen)}
              className="p-1 rounded-md hover:bg-gray-100 transition"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  isOrdersOpen ? "rotate-180" : ""
                }`}
              />
            </button> */}
          </div>

          {/* Child Links (collapsible) */}
          <div
            className={`ml-6 overflow-hidden transition-all duration-300 ${
              isOrdersOpen ? "max-h-40" : "max-h-0"
            }`}
          >
            <NavLink
              onClick={onClose}
              to="/admin/orders/accepted"
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition ${
                  isActive ? activeNavLinkClasses : ""
                }`
              }
            >
              Accepted Orders
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
