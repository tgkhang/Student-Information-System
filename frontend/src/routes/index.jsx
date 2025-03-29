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
        { path: "500", element: <Page500 /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
        { path: "faqs", element: <FAQs /> },
        { path: "test", element: <StudentDashboardPage /> },

        { path: "home", element: <GuestPage />},
        { path: "about", element: <AboutUs /> },
        { path: "contact", element: <Contact /> },
        { path: "services", element: <Services /> }
        
      ],
    },
    // Student Routes
    {
      path: "student",
      children: [
        { path: "dashboard", element: <StudentDashboardPage /> },
        {
          path: "classRegistration",
          element: <StudentClassRegistrationPage />,
        },
        {
          path: "classAndAssignment",
          element: <StudentClassesAndAssignmentsPage />,
        },
      ],
    },

    // Admin Routes (placeholder for future)
    {
      path: "admin",
      children: [
        // Admin routes will go here
      ],
    },

    // Teacher Routes (placeholder for future)
    {
      path: "teacher",
      children: [
        // Teacher routes will go here
      ],
    },
    // // Course Routes
    // {
    //   path: "courses",
    //   children: [
    //     { path: "my-courses", element: <MyCoursesPage /> },
    //     { path: "available", element: <AvailableCoursesPage /> },
    //     { path: "catalog", element: <CourseCatalogPage /> },
    //   ],
    // },

    // // Schedule Routes
    // {
    //   path: "schedule",
    //   children: [
    //     {
    //       path: "",
    //       element: <Navigate to="/student/classAndAssignment" replace />,
    //     },
    //     { path: "timetable", element: <TimetablePage /> },
    //   ],
    // },
    {
      path: "ministry",
      children: [
        { path: "studentList", element: <StudentListPage /> },
        { path: "lecturerList", element: <LecturerListPage /> },
        { path: "lecturerProfile/:id", element: <LecturerProfile /> },
        { path: "studentProfile/:id", element: <StudentProfile /> },
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

// GUEST
const GuestPage = Loadable(lazy(() => import("../pages/GuestPage")));
const AboutUs = Loadable(lazy(() => import("../pages/AboutUs")));
const Contact = Loadable(lazy(() => import("../pages/Contact")));
const Services = Loadable(lazy(() => import("../pages/Services")));

// OTHERS
const Page500 = Loadable(lazy(() => import("../pages/Page500")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
const ComingSoon = Loadable(lazy(() => import("../pages/ComingSoon")));
const Maintenance = Loadable(lazy(() => import("../pages/Maintenance")));
const FAQs = Loadable(lazy(() => import("../pages/Faqs")));

const TestPage = Loadable(lazy(() => import("../pages/TestPage")));

// STUDENT
const StudentDashboardPage = Loadable(lazy(() => import("../pages/Student/StudentDashboardPage")))
const StudentClassRegistrationPage = Loadable(lazy(() => import("../pages/Student/StudentClassRegistrationPage")))
const StudentClassesAndAssignmentsPage = Loadable(
  lazy(() => import("../pages/Student/StudentClassesAndAssignmentsPage")),
)



// MINISTRY
const StudentListPage = Loadable(
  lazy(() => import("../pages/ministry/StudentListPage"))
);
const LecturerListPage = Loadable(
  lazy(() => import("../pages/ministry/LecturerListPage"))
);
const LecturerProfile = Loadable(
  lazy(() => import("../pages/ministry/LecturerProfileEditPage"))
);
const StudentProfile = Loadable(
  lazy(() => import("../pages/ministry/StudentProfileEditPage"))
);