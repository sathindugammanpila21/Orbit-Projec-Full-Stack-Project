import React, { useRef, Fragment } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { Dialog, Transition } from '@headlessui/react'; // For accessible modals

// --- API Calls & Redux ---
import { AddMemberToProject } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";

// --- Icons ---
import { XMarkIcon } from '@heroicons/react/24/outline';


function MemberForm({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) {
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const onFinish = async (e) => {
    e.preventDefault();
    const values = {
        email: formRef.current.email.value,
        role: formRef.current.role.value,
    };

    try {
      const emailExists = project.members.find(
        (member) => member.user.email === values.email
      );

      if (emailExists) {
        throw new Error("User is already a member of this project");
      }

      dispatch(SetLoading(true));
      const response = await AddMemberToProject({
        projectId: project._id,
        email: values.email,
        role: values.role,
      });
      dispatch(SetLoading(false));

      if (response.success) {
        message.success(response.message);
        reloadData();
        setShowMemberForm(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <Transition appear show={showMemberForm} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setShowMemberForm(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-blue-600 flex justify-between items-center"
                >
                  Add Member
                  <button onClick={() => setShowMemberForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                    <XMarkIcon className="w-5 h-5"/>
                  </button>
                </Dialog.Title>

                <form ref={formRef} onSubmit={onFinish} className="mt-6">
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      placeholder="e.g., member@orbit.com"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowMemberForm(false)}
                      className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    {/* --- FIX: Replaced custom color classes with built-in Tailwind classes --- */}
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none"
                    >
                      Add Member
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

export default MemberForm;