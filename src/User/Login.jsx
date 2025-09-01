import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { state } = useLocation();
  const from = state?.location?.pathname;
  if (from) console.log("detected direction", from);
  const handleSubmit = async (e) => {
    setErr("");
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { data } = response;
      const accessToken = data.accessToken;
      const id = data.user.id;
      const name = data.user.name;
      login({ accessToken, id, name });
      toast.success("Login successful");
      navigate(from || "/");
    } catch (err) {
      if (!err?.response) return setErr("No server response");
      setErr(err?.response?.data?.error || "Login failed");
      console.log(err);
    }
  };

  const toSignup = () =>
    navigate("/signup", { state: { location: { pathname: from } } });

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Login to your account
        </h1>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        {err && <p className="text-sm text-red-500 text-center">{err}</p>}
        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          Login
        </button>
        <p className="text-center">
          New here?{" "}
          <span className="text-blue-700 underline" onClick={toSignup}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
