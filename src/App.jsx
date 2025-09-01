import { Route, Routes } from "react-router-dom";
import Login from "./User/Login";
import Chat from "./components/Chat";
import Feed from "./components/Feed";
import { ToastContainer } from "react-toastify";
import BottomNav from "./components/BottomNav";
import Profile from "./User/Profile";
import RequireAuth from "./components/RequireAuth";
import Signup from "./User/Signup";
import Symptoms from "./components/Symptoms";
import EditProfile from "./components/EditProfile";
import NearbyHospitals from "./components/NearbyHospitals";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route element={<RequireAuth />}></Route>{" "}
        <Route path="/ai" element={<Chat />} />
        <Route path="/hospitals" element={<NearbyHospitals />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer />
      <BottomNav />
    </>
  );
}

export default App;
