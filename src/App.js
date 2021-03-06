import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router";
import SignIn from "./pages/Auth/Signin";
import { UserSignUp, AdminSignUp } from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./global.css";
import Cases, { ViewAllCases } from "./pages/Cases/Cases";
import Users from "./pages/Users/Users";
import Suspects from "./pages/Suspects/Suspects";
import Evidence from "./pages/Evidence/Evidence";
import AddEvidence from "./pages/Evidence/AddEvidence";
import { Util } from "./helpers/util";
// context api
import { DataContextProvider } from "./context/DataContext";
import AddSuspects from "./pages/Suspects/AddSuspects";
import Notfound from "./pages/Notfound/Notfound";

const util = new Util();

function App() {
  return (
    <DataContextProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={util.isLoggedIn() ? <Dashboard /> : <SignIn />}
          />
          <Route
            path="/signin"
            element={util.isLoggedIn() ? <Dashboard /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={util.isLoggedIn() ? <Dashboard /> : <UserSignUp />}
          />
          <Route
            path="/admin/officer/signup"
            element={util.isLoggedIn() ? <Dashboard /> : <AdminSignUp />}
          />
          <Route
            path="/officer/dashboard/:id"
            element={util.isLoggedIn() ? <Dashboard /> : <SignIn />}
          />
          <Route
            path="/officer/assignCase"
            element={util.isLoggedIn() ? <Cases /> : <SignIn />}
          />
          <Route
            path="/officer/viewCase"
            element={util.isLoggedIn() ? <ViewAllCases /> : <SignIn />}
          />
          <Route
            path="/officer/users"
            element={util.isLoggedIn() ? <Users /> : <SignIn />}
          />
          <Route
            path="/officer/suspects/add"
            element={util.isLoggedIn() ? <AddSuspects /> : <SignIn />}
          />
          <Route
            path="/officer/suspects"
            element={util.isLoggedIn() ? <Suspects /> : <SignIn />}
          />
          <Route
            path="/officer/evidence"
            element={util.isLoggedIn() ? <Evidence /> : <SignIn />}
          />
          <Route
            path="/officer/addEvidence"
            element={util.isLoggedIn() ? <AddEvidence /> : <SignIn />}
          />
          <Route
            path="*"
            element={util.isLoggedIn() ? <Notfound /> : <SignIn />}
          />
        </Routes>
      </Router>
    </DataContextProvider>
  );
}

export default App;
