import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

// --- API Calls & Redux ---
import { GetProjectsByRole } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { getDateFormat } from "../../utils/helpers";

// --- NEW: Import the ProjectForm component ---
// Note: You may need to adjust this path based on your folder structure
import ProjectForm from "../../pages/Profile/Projects/ProjectForm";

// --- Icons ---
import {
  UserCircleIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  PlusIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";


const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "in-progress":
      return {
        badge: "bg-sky-100 text-sky-800",
        borderColor: "border-sky-500",
      };
    case "completed":
      return {
        badge: "bg-emerald-100 text-emerald-800",
        borderColor: "border-emerald-500",
      };
    case "archived":
      return {
        badge: "bg-slate-100 text-slate-600",
        borderColor: "border-slate-400",
      };
    default:
      return {
        badge: "bg-amber-100 text-amber-800",
        borderColor: "border-amber-500",
      };
  }
};


function Home() {
  // --- NEW: State to manage the modal visibility ---
  const [showProjectForm, setShowProjectForm] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole();
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

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-6 lg:p-8">
      
      {/* --- Page Header with New "Add Project" Button --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Hey {user?.firstName}, Welcome Back!
          </h1>
          <p className="mt-1 text-slate-500">Here are your active projects.</p>
        </div>
        {/* --- NEW: Add Project Button --- */}
        <button
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          onClick={() => setShowProjectForm(true)}
        >
            <PlusIcon className="w-5 h-5"/>
            Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => {
            const statusStyle = getStatusStyles(project.status);
            return(
            <div
              key={project._id}
              className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col border-l-4 ${statusStyle.borderColor}`}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold text-slate-800 group-hover:text-primary transition-colors duration-300">
                      {project.name}
                    </h2>
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${statusStyle.badge}`}>
                        {project.status}
                    </span>
                </div>
                <p className="text-slate-500 text-sm mt-3 h-12 overflow-hidden text-ellipsis">
                  {project.description}
                </p>
              </div>

              <div className="mt-auto border-t border-slate-100 px-6 py-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-slate-600">
                    <UserCircleIcon className="w-5 h-5 mr-3 text-slate-400" />
                    <span className="font-medium">Owner</span>
                    <span className="ml-auto font-semibold text-slate-700">
                      {project.owner.firstName} {project.owner.lastName}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <CalendarDaysIcon className="w-5 h-5 mr-3 text-slate-400" />
                    <span className="font-medium">Created</span>
                    <span className="ml-auto font-semibold text-slate-700">
                      {getDateFormat(project.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div 
                className="bg-slate-50 rounded-b-xl px-6 py-3 text-center text-primary font-semibold flex items-center justify-center gap-2 cursor-pointer group-hover:bg-primary group-hover:text-white transition-all duration-300"
              >
                <span>View Project</span>
                <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )})
        ) : (
          <div className="col-span-full mt-16 flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm">
            <BriefcaseIcon className="w-16 h-16 text-slate-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-700">No Projects Found</h3>
            <p className="mt-2 text-slate-500">Get started by creating your first project.</p>
            <button
                onClick={() => setShowProjectForm(true)}
                className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors duration-300"
            >
                <PlusIcon className="w-5 h-5" />
                Create New Project
            </button>
          </div>
        )}
      </div>
      
      {/* --- NEW: Conditionally render the ProjectForm modal --- */}
      {showProjectForm && (
        <ProjectForm
          show={showProjectForm}
          setShow={setShowProjectForm}
          reloadData={getData}
          project={null} // Pass null for creating a new project
        />
      )}
    </div>
  );
}

export default Home;