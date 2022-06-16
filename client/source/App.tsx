import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useCurrentUserQuery } from "./generated/graphql";
import {
  CreateProject,
  Dashboard,
  ForgotPassword,
  ListProjects,
  Loading,
  Login,
  ResetPassword,
  ShowProject,
  SignUp,
} from "./pages";
import { routes } from "./routes";

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
            <Route path="*" element={<Navigate to={routes.login} replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
