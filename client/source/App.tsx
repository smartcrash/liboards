import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
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
            <Route path="/" element={<Dashboard />}>
              <Route path="/" element={<ListProjects />}></Route>
              <Route path="/p" element={<CreateProject />}></Route>
              <Route path="/p/:id" element={<ShowProject />}></Route>
            </Route>
            <Route path="*" element={<Navigate to={"/"} replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to={"/login"} replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
