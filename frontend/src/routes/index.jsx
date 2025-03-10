import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
// components
import LoadingScreen from "../components/LoadingScreen";

// ----------------------------------------------------------------------

const Loadable = (Component) => {
  const WrappedComponent = (props) => {
    //const { pathname } = useLocation();
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
  
  WrappedComponent.displayName = `Loadable(${Component.name || "Component"})`;


  return WrappedComponent;
};


export default function Router() {
  return useRoutes([
    {
      path: "auth",
      children: [
        { path: "login", element: <Login /> },
        // { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        // { path: "verify", element: <VerifyCode /> },
      ],
    },
    // Main Routes
    {
      path: "*",
    //   element: <LogoOnlyLayout />,
      children: [
        { path: "coming-soon", element: <ComingSoon /> },
        { path: "maintenance", element: <Maintenance /> },
        { path: "about-us", element: <AboutUs/>},
        { path: "500", element: <Page500 /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
        { path: "faqs", element: <FAQs/>},
        { path: "test", element: <TestPage/>},
      ],
    },
    {
      path: "student",
      children: [
        { path: "studentClassRegistration", element: <StudentClassRegistrationPage/>},
        { path: "studentClassAndAssignment", element: <StudentClassAndAssignmentPage/>},
      ],
    },
    {
      path: "ministry",
      children: [
        { path: "studentList", element: <StudentListPage /> },
        { path: "lecturerList", element: <LecturerListPage /> },
      ],
    },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import("../pages/authentication/Login")));
// const Register = Loadable(
//   lazy(() => import("../pages/authentication/Register"))
// );
const ForgotPassword = Loadable(
  lazy(() => import("../pages/authentication/ForgotPassword"))
);
// const VerifyCode = Loadable(
//   lazy(() => import("../pages/authentication/VerifyCode"))
// );

// MAIN
const Page500 = Loadable(lazy(() => import("../pages/Page500")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
const AboutUs = Loadable(lazy(() => import("../pages/AboutUs")));
const ComingSoon = Loadable(lazy(() => import("../pages/ComingSoon")));
const Maintenance = Loadable(lazy(() => import("../pages/Maintenance")));
const FAQs = Loadable(lazy(() => import("../pages/Faqs")));

const TestPage = Loadable(lazy(() => import("../pages/TestPage")));

// STUDENT
const StudentClassRegistrationPage = Loadable(lazy(() => import("../pages/Student/StudentClassRegistration")));
const StudentClassAndAssignmentPage =  Loadable(lazy(() => import("../pages/Student/StudentClassesAndAssignmentsPage")));

// MINISTRY
const StudentListPage = Loadable(lazy(() => import("../pages/ministry/StudentListPage")));
const LecturerListPage = Loadable(lazy(() => import("../pages/ministry/LecturerListPage")));