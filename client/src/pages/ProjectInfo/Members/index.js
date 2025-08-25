import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

// --- API Calls & Redux ---
import { RemoveMemberFromProject } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";

// --- Child Components ---
import MemberForm from "./MemberForm";

// --- Icons ---
import { TrashIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';


function Members({ project, reloadData }) {
  const [role, setRole] = React.useState("");
  const [showMemberForm, setShowMemberForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  
  // --- FIX: Made the owner check more robust ---
  const isOwner = (project.owner._id || project.owner) === user._id;

  const deleteMember = async (memberId) => {
    try {
      dispatch(SetLoading(true));
      const response = await RemoveMemberFromProject({
        projectId: project._id,
        memberId,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        reloadData();
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-6 gap-4">
        <div className="relative">
          <select
            className='bg-white border border-slate-300 rounded-md py-2 pl-3 pr-8 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none'
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option value="">All Roles</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <button
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            onClick={() => setShowMemberForm(true)}
          >
            <PlusIcon className="w-5 h-5"/>
            Add Member
          </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white">
              <tr className="border-b-2 border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                {isOwner && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>}
              </tr>
            </thead>
            <tbody className="bg-white">
              {project.members.filter(m => role ? m.role === role : true).length > 0 ? (
                project.members
                  .filter((member) => (role ? member.role === role : true))
                  .map((member) => (
                    <tr key={member._id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{member.user.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{member.user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{member.user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        <span className="uppercase">{member.role}</span>
                      </td>
                      {isOwner && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteMember(member._id)}
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
                  <td colSpan={isOwner ? 5 : 4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                        <UserGroupIcon className="w-12 h-12" />
                        <h3 className="text-lg font-semibold">No members found</h3>
                        <p className="text-sm">Add a member to this project to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showMemberForm && (
        <MemberForm
          showMemberForm={showMemberForm}
          setShowMemberForm={setShowMemberForm}
          reloadData={reloadData}
          project={project}
        />
      )}
    </div>
  );
}

export default Members;