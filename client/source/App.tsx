import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useCurrentUserQuery } from "./generated/graphql";
import {
  Dashboard,
  ForgotPassword,
  Loading,
  Login,
  ResetPassword,
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
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="*" element={<Navigate to={"/"} replace />}></Route>
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
