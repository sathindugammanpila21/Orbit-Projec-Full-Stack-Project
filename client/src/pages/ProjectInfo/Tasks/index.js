import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { Dialog, Transition } from '@headlessui/react';

// --- API Calls & Redux ---
import { DeleteTask, GetAllTasks, UpdateTask } from "../../../apicalls/tasks";
import { AddNotification } from "../../../apicalls/notifications";
import { SetLoading } from "../../../redux/loadersSlice";

// --- Child Components ---
import TaskForm from "./TaskForm";
import Divider from "../../../components/Divider";

// --- Utils & Helpers ---
import { getDateFormat } from "../../../utils/helpers";

// --- Icons ---
import { PlusIcon, PencilSquareIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

function Tasks({ project }) {
  const [filters, setFilters] = useState({ status: "all" });
  const [showViewTask, setShowViewTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [task, setTask] = useState(null);
  
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const isOwnerOrAdmin = project.members.some(member => member.user._id === user._id && (member.role === 'owner' || member.role === 'admin'));

  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({ project: project._id, ...filters });
      dispatch(SetLoading(false));
      if (response.success) {
        setTasks(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteTask(id);
      dispatch(SetLoading(false));
      if (response.success) {
        getTasks();
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async ({ task, status }) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateTask({ _id: task._id, status });
      dispatch(SetLoading(false));
      if (response.success) {
        getTasks();
        message.success(response.message);
        AddNotification({
          title: "Task Status Updated",
          description: `${task.name} status has been updated to ${status}`,
          user: task.assignedBy._id,
          onClick: `/project/${project._id}`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, [filters]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inprogress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "closed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className='flex justify-end items-center mb-6 gap-4'>
        <div className="relative">
          <select
            className='bg-white border border-slate-300 rounded-md py-2 pl-3 pr-8 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none'
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            onClick={() => {
              setTask(null); // Ensure we're creating a new task
              setShowTaskForm(true);
            }}
          >
            <PlusIcon className="w-5 h-5"/>
            Add Task
          </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white">
              <tr className="border-b-2 border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Task Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                {isOwnerOrAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>}
              </tr>
            </thead>
            <tbody className="bg-white">
              {tasks.length > 0 ? (
                tasks.map((taskItem) => (
                  <tr key={taskItem._id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => { setTask(taskItem); setShowViewTask(true); }}
                      >
                        {taskItem.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{`${taskItem.assignedTo.firstName} ${taskItem.assignedTo.lastName}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getDateFormat(taskItem.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        className={`py-1 px-2 rounded-md font-medium text-xs ${getStatusClasses(taskItem.status)} border-none focus:outline-none focus:ring-1 focus:ring-primary appearance-none`}
                        value={taskItem.status}
                        onChange={(e) => onStatusUpdate({ task: taskItem, status: e.target.value })}
                        disabled={!isOwnerOrAdmin && taskItem.assignedTo._id !== user._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    {isOwnerOrAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                        <button
                          onClick={() => { setTask(taskItem); setShowTaskForm(true); }}
                          className="p-2 bg-transparent border-none text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-colors"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTask(taskItem._id)}
                          className="p-2 bg-transparent border-none text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-full transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isOwnerOrAdmin ? 5 : 4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <ClipboardDocumentListIcon className="w-12 h-12" />
                      <h3 className="text-lg font-semibold">No tasks found</h3>
                      <p className="text-sm">Add a task to this project to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
          task={task}
          setTask={setTask}
        />
      )}

      {task && showViewTask && (
        <Transition appear show={showViewTask} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setShowViewTask(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-slate-900">
                      {task.name}
                    </Dialog.Title>
                    <div className="mt-4">
                      <Divider />
                      <div className="flex flex-col gap-5 mt-4">
                        <div>
                          <h3 className='text-md font-semibold text-slate-700'>Description</h3>
                          <p className='text-slate-600 mt-1 text-sm'>{task.description}</p>
                        </div>
                        <div>
                          <h3 className='text-md font-semibold text-slate-700'></h3>
                          <div className="flex gap-4 flex-wrap mt-2">
                            {task.attachments?.length > 0 ? task.attachments.map((image, i) => (
                              <img key={i} src={image} alt="attachment" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                            )) : <p className='text-slate-500 text-sm'>No attachments found.</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={() => setShowViewTask(false)}>
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}

export default Tasks;
