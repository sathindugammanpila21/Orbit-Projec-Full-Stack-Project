import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Components
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";

// Lazy-loaded Pages for performance optimization
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const ProjectInfo = lazy(() => import("./pages/ProjectInfo"));
const Register = lazy(() => import("./pages/Register"));

// Fallback error boundary component
function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-screen text-red-600">
      <h1>Something went wrong. Please refresh the page.</h1>
    </div>
  );
}

function App() {
  const { loading } = useSelector((state) => state.loaders);

  // Define protected and public routes separately
  const protectedRoutes = [
    { path: "/", element: <Home /> },
    { path: "/project/:id", element: <ProjectInfo /> },
    { path: "/profile", element: <Profile /> },
  ];

  const publicRoutes = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ];

  return (
    <>
      {/* Global full-page spinner (controlled by Redux) */}
      {loading && <Spinner />}

      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Protected routes */}
            {protectedRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedPage>{element}</ProtectedPage>}
              />
            ))}

            {/* Public routes */}
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* 404 fallback (optional) */}
            <Route
              path="*"
              element={<ErrorFallback />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
