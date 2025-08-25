import React, { useRef, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { Dialog, Transition } from "@headlessui/react";

// --- API Calls & Redux ---
import { CreateProject, EditProject } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";

// --- Icons ---
import { XMarkIcon } from "@heroicons/react/24/outline";

function ProjectForm({ show, setShow, reloadData, project }) {
  const formRef = useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const getFormValues = () => {
    const name = formRef.current.name.value.trim();
    const description = formRef.current.description.value.trim();
    return { name, description };
  };

  const onFinish = async (e) => {
    e.preventDefault();
    const values = getFormValues();

    if (!values.name || !values.description) {
      message.error("Please fill out all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      dispatch(SetLoading(true));
      let response;
      if (project) {
        response = await EditProject({ ...values, _id: project._id });
      } else {
        response = await CreateProject({
          ...values,
          owner: user._id,
          members: [{ user: user._id, role: "owner" }],
        });
      }
      dispatch(SetLoading(false));
      setSubmitting(false);

      if (response.success) {
        message.success(response.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      setSubmitting(false);
      message.error(error.message);
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setShow(false)}>
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-primary flex justify-between items-center"
                >
                  {project ? "Edit Project" : "Create Project"}
                  <button
                    aria-label="Close dialog"
                    onClick={() => setShow(false)}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </Dialog.Title>

                <form ref={formRef} onSubmit={onFinish} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={project?.name}
                      className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm px-3 py-2"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Project Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      defaultValue={project?.description}
                      className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm px-3 py-2"
                      placeholder="Enter project description"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShow(false)}
                      className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        submitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      }`}
                    >
                      {submitting ? "Saving..." : "Save"}
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

export default ProjectForm;
