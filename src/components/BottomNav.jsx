import { NavLink } from "react-router-dom";
import {
  Home,
  Bot,
  Stethoscope,
  User,
  LogIn,
  UserPlus,
  Hospital,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { icon } from "leaflet";

const BottomNav = () => {
  const { accessToken, loading } = useAuth();
  const links = [
    { to: "/", label: "Feed", icon: Home },
    { to: "/ai", label: "AI", icon: Bot },
    { to: "/symptoms", label: "Checker", icon: Stethoscope },
    ...(!loading && accessToken
      ? [
          { to: "/hospitals", icon: Hospital, label: "Hospitals" },

          { to: "/profile", icon: User, label: "Profile" },
        ]
      : [
          { to: "/login", label: "Login", icon: LogIn },
          { to: "/signup", label: "Sign up", icon: UserPlus },
        ]),
  ];
  return (
    <>
      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around items-center py-2 z-50 md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center text-sm"
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Side Nav (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-48 bg-white border-r shadow-sm flex-col p-4 z-40">
        <h2 className="text-lg font-semibold mb-6">HOMEDOC</h2>
        <nav className="flex flex-col gap-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default BottomNav;
