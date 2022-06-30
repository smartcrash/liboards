import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useCurrentUserQuery } from "./generated/graphql";
import Loading from "./pages/loading";
import { routes } from "./routes";

const loadable = (factory: Parameters<typeof lazy>[0]) => () => {
  const Component = lazy(factory);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Component />
    </Suspense>
  );
};

const ForgotPassword = loadable(() => import("./pages/forgot-password"));
const Login = loadable(() => import("./pages/login"));
const ResetPassword = loadable(() => import("./pages/reset-password"));
const SignUp = loadable(() => import("./pages/sign-up"));

const Dashboard = loadable(() => import("./pages/dashboard"));
const ListProjects = loadable(() => import("./pages/projects/list"));
const CreateProject = loadable(() => import("./pages/projects/create"));
const ShowProject = loadable(() => import("./pages/projects/show"));
const OAuthCallback = loadable(() => import("./pages/OAuthCallback"));

function App() {
  const [{ data, fetching }] = useCurrentUserQuery();
  const user = !!data?.currentUser;

  return (
    <Router>
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
            <Route path={routes["oauth.callback"]} element={<OAuthCallback />} />
            <Route path="*" element={<Navigate to={routes.login} replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
