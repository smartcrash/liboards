import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useCurrentUserQuery } from "./generated/graphql";
import Loading from "./pages/loading";
import { routes } from "./routes";

const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const Login = lazy(() => import("./pages/login"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const SignUp = lazy(() => import("./pages/sign-up"));

const Dashboard = lazy(() => import("./pages/dashboard"));
const ListProjects = lazy(() => import("./pages/projects/list"));
const CreateProject = lazy(() => import("./pages/projects/create"));
const ShowProject = lazy(() => import("./pages/projects/show"));

function App() {
  const [{ data, fetching }] = useCurrentUserQuery();
  const user = !!data?.currentUser;

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {fetching ? (
            <Route path="*" element={<Loading />} />
          ) : user ? (
            <>
              <Route path={routes.index} element={<Dashboard />}>
                <Route path={routes.index} element={<Navigate to={routes["projects.list"]} replace />} />
                <Route path={routes["projects.list"]} element={<ListProjects />} />
                <Route path={routes["projects.create"]} element={<CreateProject />} />
                <Route path={routes["projects.show"]} element={<ShowProject />} />
              </Route>
              <Route path="*" element={<Navigate to={routes.index} replace />} />
            </>
          ) : (
            <>
              <Route path={routes.login} element={<Login />} />
              <Route path={routes.signUp} element={<SignUp />} />
              <Route path={routes.forgotPwd} element={<ForgotPassword />} />
              <Route path={routes.resetPwd} element={<ResetPassword />} />
              <Route path="*" element={<Navigate to={routes.login} replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
