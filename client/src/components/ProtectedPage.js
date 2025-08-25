import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message, Badge, Avatar } from "antd";

// --- API Calls & Redux ---
import { GetLoggedInUser } from "../apicalls/users";
import { GetAllNotifications } from "../apicalls/notifications";
import { SetUser, SetNotifications } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";

// --- Child Components ---
import Notifications from "./Notifications";

// --- UPDATED: Using Heroicons for a consistent, modern look ---
import { BellIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";


function ProtectedPage({ children }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.users);

  // --- All functions below are unchanged ---

  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetLoggedInUser();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllNotifications();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetNotifications(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  // --- The Ant Design Dropdown and menu array have been removed ---

  return (
    user && (
      <div className="bg-slate-50 min-h-screen">
        <header className="flex justify-between items-center px-4 md:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md sticky top-0 z-10">
          <h1
            className="text-2xl font-semibold text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            Orbit
          </h1>

          {/* --- UPDATED: Right-side actions with direct buttons --- */}
          <div className="flex items-center gap-4 md:gap-6">
            <Badge
              count={notifications.filter((n) => !n.read).length}
              className="cursor-pointer"
              onClick={() => setShowNotifications(true)}
            >
              <BellIcon className="w-6 h-6 text-white transition-transform duration-300 hover:scale-110" />
            </Badge>

            {/* Profile/Projects Button */}
            <div
              role="button"
              tabIndex={0}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
              onClick={() => navigate("/profile")}
              onKeyDown={(e) => e.key === 'Enter' && navigate("/profile")}
            >
              <Avatar className="bg-white text-primary font-semibold">
                {user?.firstName[0].toUpperCase()}
              </Avatar>
              <span className="font-medium text-white hidden md:block">
                {user?.firstName}
              </span>
            </div>

            {/* Log Out Button */}
            <div
              role="button"
              tabIndex={0}
              className="p-2 cursor-pointer rounded-full transition-colors hover:bg-white/10"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  localStorage.removeItem("token");
                  navigate("/login");
                }
              }}
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </header>

        <main className="p-5">{children}</main>

        {showNotifications && (
          <Notifications
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            reloadNotifications={getNotifications}
          />
        )}
      </div>
    )
  );
}

export default ProtectedPage;