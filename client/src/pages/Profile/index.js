import React from "react";
import Projects from "./Projects";

function Profile() {
  return (
    // A main container with padding for consistent spacing
    <div className="p-4 sm:p-6 lg:p-8">
      {/* A clean header for the page */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">My Projects</h1>
        <p className="mt-1 text-slate-500">
          Here is a list of all the projects you own.
        </p>
      </div>

      {/* --- The Tabs component has been removed --- */}
      {/* The Projects component is now displayed directly */}
      <Projects />
    </div>
  );
}

export default Profile;