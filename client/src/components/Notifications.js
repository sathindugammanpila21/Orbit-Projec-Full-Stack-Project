import { message, Modal } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DeleteAllNotifications,
  MarkNotificationAsRead,
} from "../apicalls/notifications";
import { SetLoading } from "../redux/loadersSlice";
import { SetNotifications } from "../redux/usersSlice";

function Notifications({ showNotifications, setShowNotifications }) {
  const { notifications } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const readNotifications = async () => {
    if (!notifications || notifications.length === 0) {
      return;
    }
    try {
      dispatch(SetLoading(true));
      const response = await MarkNotificationAsRead();
      if (response.success) {
        dispatch(SetNotifications(response.data));
        message.success("All notifications marked as read.");
      } else {
        message.error(response.message || "Failed to mark notifications as read.");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong.");
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const deleteAllNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteAllNotifications();
      if (response.success) {
        dispatch(SetNotifications([]));
        message.success("All notifications deleted.");
      } else {
        message.error(response.message || "Failed to delete notifications.");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong.");
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    if (notifications.length > 0) {
      readNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      title="NOTIFICATIONS"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      centered
      footer={null}
      width={1000}
    >
      <div className="flex flex-col gap-5 mt-5">
        {notifications.length > 0 ? (
          <div className="flex justify-end">
            <span
              className="text-[15px] underline cursor-pointer"
              onClick={deleteAllNotifications}
            >
              Delete All
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="text-[15px]">No Notifications</span>
          </div>
        )}

        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="flex justify-between items-end border border-solid p-2 rounded cursor-pointer"
            onClick={() => {
              setShowNotifications(false);
              navigate(notification.onClick);
            }}
          >
            <div className="flex flex-col">
              <span className="text-md font-semibold text-gray-700">
                {notification.title}
              </span>
              <span className="text-sm">{notification.description}</span>
            </div>
            <div>
              <span className="text-sm">
                {moment(notification.createdAt).fromNow()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default Notifications;
