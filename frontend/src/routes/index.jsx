import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
// components
import LoadingScreen from "../components/LoadingScreen";

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "auth",
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "verify", element: <VerifyCode /> },
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
      ],
    },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import("../pages/authentication/Login")));
const Register = Loadable(
  lazy(() => import("../pages/authentication/Register"))
);
const ForgotPassword = Loadable(
  lazy(() => import("../pages/authentication/ForgotPassword"))
);
const VerifyCode = Loadable(
  lazy(() => import("../pages/authentication/VerifyCode"))
);

// MAIN
const Page500 = Loadable(lazy(() => import("../pages/Page500")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
const AboutUs = Loadable(lazy(() => import("../pages/AboutUs")));
const ComingSoon = Loadable(lazy(() => import("../pages/ComingSoon")));
const Maintenance = Loadable(lazy(() => import("../pages/Maintenance")));
const FAQs = Loadable(lazy(() => import("../pages/Faqs")));