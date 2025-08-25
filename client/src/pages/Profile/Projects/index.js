import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

// --- API Calls & Redux ---
import { DeleteProject, GetAllProjects } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";

// --- Child Components & Helpers ---
import ProjectForm from "./ProjectForm";
import { getDateFormat } from "../../../utils/helpers";

// --- Icons ---
import { PencilSquareIcon, TrashIcon, PlusIcon, FolderOpenIcon } from '@heroicons/react/24/outline';


// Helper for colored status badges
const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-sky-100 text-sky-800";
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "archived": return "bg-slate-100 text-slate-600";
      default: return "bg-amber-100 text-amber-800";
    }
};

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllProjects({ owner: user._id });
      dispatch(SetLoading(false));
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const onDelete = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteProject(id);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          onClick={() => {
            setSelectedProject(null);
            setShow(true);
          }}
        >
          <PlusIcon className="w-5 h-5"/>
          Add Project
        </button>
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white">
              <tr className="border-b-2 border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project._id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{project.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${getStatusStyles(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getDateFormat(project.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onDelete(project._id)} className="p-2 bg-transparent border-none text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-full transition-colors"><TrashIcon className="w-5 h-5"/></button>
                        <button onClick={() => { setSelectedProject(project); setShow(true); }} className="p-2 bg-transparent border-none text-slate-500 hover:bg-slate-100 hover:text-primary rounded-full transition-colors"><PencilSquareIcon className="w-5 h-5"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                        <FolderOpenIcon className="w-12 h-12" />
                        <h3 className="text-lg font-semibold">No projects yet</h3>
                        <p className="text-sm">Click "Add Project" to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {show && (
        <ProjectForm
          show={show}
          setShow={setShow}
          reloadData={getData}
          project={selectedProject}
        />
      )}
    </div>
  );
}

export default Projects;