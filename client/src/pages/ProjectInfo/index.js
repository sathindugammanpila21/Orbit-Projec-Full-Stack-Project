import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";

// --- API Calls & Redux ---
import { GetProjectById } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { getDateFormat } from "../../utils/helpers";

// --- Child Components ---
import Members from "./Members";
import Tasks from "./Tasks";

// --- Icons ---
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ListBulletIcon,
  UsersIcon,
  CheckBadgeIcon, // New icon for status
} from "@heroicons/react/24/outline";


const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in-progress":
        return "bg-sky-100 text-sky-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "archived":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };


function ProjectInfo() {
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectById(params.id);
      dispatch(SetLoading(false));
      if (response.success) {
        setProject(response.data);
        const currentUser = response.data.members.find(
          (member) => member.user._id === user._id
        );
        setCurrentUserRole(currentUser.role);
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
  
  const TABS = [
    { name: "Tasks", id: "tasks", icon: ListBulletIcon },
    { name: "Members", id: "members", icon: UsersIcon },
  ];

  // A small helper component for the detail items in the sidebar
  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-sm text-slate-500">{label}</h3>
        <p className="font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );

  return (
    project && (
      <div className="p-4 sm:p-6 lg:p-8">
        <button
            onClick={() => navigate(-1)}
            className="bg-transparent border-none group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary mb-6 transition-colors focus:outline-none"
        >
            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Projects
        </button>

        {/* --- NEW: Two-Column Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- Left Column (Main Content) --- */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-800">{project?.name}</h1>
              <p className="mt-2 text-slate-500 max-w-3xl">{project?.description}</p>
            </div>
            
            <div>
              <nav className="flex space-x-8" aria-label="Tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.id)}
                    className={`bg-transparent border-none inline-flex items-center gap-2 py-4 px-1 text-sm transition-colors duration-200 focus:outline-none
                      ${activeTab === tab.id
                        ? 'font-semibold text-primary'
                        : 'text-slate-500 hover:text-primary'
                      }`}
                  >
                    <tab.icon className="w-5 h-5"/>
                    {tab.name}
                  </button>
                ))}
              </nav>
              <hr className="border-slate-200" />
              <div className="py-6">
                {activeTab === 'tasks' && <Tasks project={project} />}
                {activeTab === 'members' && <Members project={project} reloadData={getData} />}
              </div>
            </div>
          </div>

          {/* --- Right Column (Details Sidebar) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Project Details</h2>
                <div className="space-y-5">
                    <DetailItem 
                        icon={<CheckBadgeIcon className="w-5 h-5 text-slate-400" />}
                        label="Status"
                        value={<span className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${getStatusStyles(project.status)}`}>{project.status}</span>}
                    />
                    <hr className="border-slate-100" />
                    <DetailItem 
                        icon={<CalendarDaysIcon className="w-5 h-5 text-slate-400" />}
                        label="Created On"
                        value={getDateFormat(project.createdAt)}
                    />
                    <DetailItem 
                        icon={<UserCircleIcon className="w-5 h-5 text-slate-400" />}
                        label="Project Owner"
                        value={`${project.owner.firstName} ${project.owner.lastName}`}
                    />
                    <DetailItem 
                        icon={<ShieldCheckIcon className="w-5 h-5 text-slate-400" />}
                        label="Your Role"
                        value={<span className="uppercase">{currentUserRole}</span>}
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default ProjectInfo;