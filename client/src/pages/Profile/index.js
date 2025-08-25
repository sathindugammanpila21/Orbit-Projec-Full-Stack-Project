import React from "react";
import Projects from "./Projects";

function Profile() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          My Projects
        </h1>
        <p className="mt-1 text-slate-500">
          Here’s a list of all the projects you own.
        </p>
      </header>

      {/* Directly displaying Projects component */}
      <Projects />
    </main>
  );
}

export default Profile;
