import React, { useState, Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { Dialog, Transition } from '@headlessui/react';

// --- API Calls & Redux ---
import { AddNotification } from "../../../apicalls/notifications";
import { CreateTask, UpdateTask } from "../../../apicalls/tasks";
import { SetLoading } from "../../../redux/loadersSlice";

// --- Icons ---
import { XMarkIcon } from '@heroicons/react/24/outline';


function TaskForm({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
}) {
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.users);
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const validateEmail = () => {
    if (!email && !task) return false; // If creating new task, email is required
    if (task) return true; // If updating, validation is not needed as field is disabled
    
    const isMemberOfProject = project.members.find(
      (member) => member.user.email === email
    );
    return !!isMemberOfProject;
  };
  const isEmailValid = validateEmail();

  const onFinish = async (e) => {
    e.preventDefault();
    const values = {
        name: formRef.current.name.value,
        description: formRef.current.description.value,
    };

    try {
      let response = null;
      dispatch(SetLoading(true));

      if (task) {
        response = await UpdateTask({
          ...values,
          project: project._id,
          assignedTo: task.assignedTo._id,
          _id: task._id,
        });
      } else {
        if (!isEmailValid) {
            throw new Error("Cannot assign task to a user who is not a project member.");
        }
        const assignedToMember = project.members.find((member) => member.user.email === email);
        const assignedToUserId = assignedToMember.user._id;
        const assignedBy = user._id;
        response = await CreateTask({
          ...values,
          project: project._id,
          assignedTo: assignedToUserId,
          assignedBy,
        });
      }

      if (response.success) {
        if (!task) {
          const assignedToMember = project.members.find((member) => member.user.email === email);
          AddNotification({
            title: `New task in "${project.name}"`,
            user: assignedToMember.user._id,
            onClick: `/project/${project._id}`,
            description: `You have been assigned a new task: ${values.name}`,
          });
        }
        reloadData();
        message.success(response.message);
        setShowTaskForm(false);
      } else {
          throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <Transition appear show={showTaskForm} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setShowTaskForm(false)}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="p-6">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-primary flex justify-between items-center">
                        {task ? "Update Task" : "Create Task"}
                        <button onClick={() => setShowTaskForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><XMarkIcon className="w-5 h-5"/></button>
                    </Dialog.Title>
                </div>

                <hr className="border-slate-200"/>

                <form ref={formRef} onSubmit={onFinish} className="p-6 space-y-5">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700">Task Name</label>
                      <input type="text" id="name" name="name" defaultValue={task?.name} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm px-3 py-2" placeholder="e.g., Implement new feature" required />
                  </div>
                  <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-700">Task Description</label>
                      <textarea id="description" name="description" rows="4" defaultValue={task?.description} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm px-3 py-2" placeholder="e.g., Detailed description of the feature" required />
                  </div>
                  <div>
                      <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-700">Assign To</label>
                      <input type="email" id="assignedTo" name="assignedTo" defaultValue={task?.assignedTo?.email} onChange={(e) => setEmail(e.target.value)} disabled={!!task} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm disabled:bg-slate-50 disabled:cursor-not-allowed px-3 py-2" placeholder="e.g., member@orbit.com" required />
                  </div>
                  {email && !isEmailValid && !task && (
                      <div className="text-red-600 text-sm">User is not a member of this project.</div>
                  )}
                  <div className="flex justify-end pt-4 border-t border-slate-200">
                      <button type="button" onClick={() => setShowTaskForm(false)} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none">Cancel</button>
                      <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                          {task ? 'Update Task' : 'Create Task'}
                      </button>
                  </div>
                </form>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TaskForm;