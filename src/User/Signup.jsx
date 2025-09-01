import { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.location?.pathname;
  if (from) console.log("detected direction", from);

  const handleSubmit = async (e) => {
    setErr("");
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (confirm !== password)
      return setErr("Password and confirm do not match");
    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      const { data } = response;
      if (!data) throw setErr("Something went wrong");
      toast.success("signup successful");
      navigate("/login", { state: { location: { pathname: from } } });
    } catch (err) {
      if (!err?.response) return setErr("No server response");
      setErr(err?.response?.data?.error || "signup failed");
      console.log(err);
    }
  };
  const toLogin = () =>
    navigate("/login", { state: { location: { pathname: from } } });
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sign Up for your free account
        </h1>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
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
        <div>
          <label
            htmlFor="confirm"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {err && <p className="text-sm text-red-500 text-center">{err}</p>}

        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          Signup
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <span className="text-blue-700 underline" onClick={toLogin}>
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
