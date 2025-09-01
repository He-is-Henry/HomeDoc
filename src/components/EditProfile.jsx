import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { accessToken } = useAuth();
  const [form, setForm] = useState(null); // null until loaded
  const [original, setOriginal] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setForm({ ...res.data, unit: "cm" });
        setOriginal(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [accessToken]);

  // handle change
  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      setDirty(JSON.stringify(updated) !== JSON.stringify(original));
      return updated;
    });
  };

  // validation
  const validate = () => {
    const newErrors = {};

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (form.dob && isNaN(Date.parse(form.dob))) {
      newErrors.dob = "Invalid date";
    }
    if (form.height && (form.height <= 0 || form.height > 300)) {
      newErrors.height = "Height must be between 1–300 cm";
    }
    if (form.weight && (form.weight <= 0 || form.weight > 600)) {
      newErrors.weight = "Weight must be between 1–600 kg";
    }
    if (
      form.bloodGroup &&
      !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(
        form.bloodGroup
      )
    ) {
      newErrors.bloodGroup = "Invalid blood group";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit
  const handleSubmit = async () => {
    if (!accessToken) return;
    if (!dirty) return toast.error("Update at least one field before saving.");
    if (!validate()) return;

    try {
      await axios.patch("/auth", form, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success("Profile updated!");
      setOriginal(form);
      setDirty(false);
      navigate("/profile");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!form) return <p>Failed to load profile.</p>;

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Profile
      </h2>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={form.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          value={form.dob ? form.dob.split("T")[0] : ""}
          onChange={(e) => handleChange("dob", e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.dob && (
          <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
        )}
      </div>

      {/* Sex */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sex
        </label>
        <select
          value={form.sex || "other"}
          onChange={(e) => handleChange("sex", e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Height */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Height
        </label>

        {/* Unit toggle */}
        <div className="flex items-center space-x-4 mb-2">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={form.unit === "cm"}
              onChange={() => setForm({ ...form, unit: "cm" })}
            />
            <span>cm</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={form.unit === "ft"}
              onChange={() =>
                setForm({ ...form, unit: "ft", feet: "", inches: "" })
              }
            />
            <span>ft/in</span>
          </label>
        </div>

        {form.unit === "cm" ? (
          <input
            type="number"
            value={form.height || ""}
            onChange={(e) => handleChange("height", Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter height in cm"
          />
        ) : (
          <div className="flex space-x-2">
            <input
              type="number"
              value={form.feet || ""}
              onChange={(e) =>
                setForm((prev) => {
                  const feet = Number(e.target.value) || 0;
                  const cm = feet * 30.48 + (prev.inches || 0) * 2.54;
                  return { ...prev, feet, height: Math.round(cm) };
                })
              }
              className="w-1/2 rounded-lg border border-gray-300 p-2"
              placeholder="Feet"
            />
            <input
              type="number"
              value={form.inches || ""}
              onChange={(e) =>
                setForm((prev) => {
                  const inches = Number(e.target.value) || 0;
                  const cm = (prev.feet || 0) * 30.48 + inches * 2.54;
                  return { ...prev, inches, height: Math.round(cm) };
                })
              }
              className="w-1/2 rounded-lg border border-gray-300 p-2"
              placeholder="Inches"
            />
          </div>
        )}

        {errors.height && (
          <p className="text-red-500 text-sm mt-1">{errors.height}</p>
        )}
      </div>

      {/* Weight */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weight (kg)
        </label>
        <input
          type="number"
          value={form.weight || ""}
          onChange={(e) => handleChange("weight", Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.weight && (
          <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
        )}
      </div>

      {/* Blood Group */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Blood Group
        </label>
        <input
          type="text"
          value={form.bloodGroup || ""}
          onChange={(e) =>
            handleChange("bloodGroup", e.target.value.toUpperCase())
          }
          placeholder="A+, O-, etc."
          className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.bloodGroup && (
          <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
        )}
      </div>

      {/* Allergies, Medications, Medical Conditions */}
      {["allergies", "medications", "medicalConditions"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="text"
            value={form[field]?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                field,
                e.target.value.split(",").map((s) => s.trim())
              )
            }
            placeholder="Separate with commas"
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      ))}

      {/* Smoking Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Smoking Status
        </label>
        <select
          value={form.smokingStatus || ""}
          onChange={(e) => handleChange("smokingStatus", e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">-- Select --</option>
          <option value="never">Never</option>
          <option value="former">Former</option>
          <option value="current">Current</option>
        </select>
      </div>

      {/* Alcohol Consumption */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alcohol Consumption
        </label>
        <select
          value={form.alcoholConsumption || ""}
          onChange={(e) => handleChange("alcoholConsumption", e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">-- Select --</option>
          <option value="none">None</option>
          <option value="occasional">Occasional</option>
          <option value="regular">Regular</option>
        </select>
      </div>

      {/* Activity Level */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Activity Level
        </label>
        <select
          value={form.activityLevel || ""}
          onChange={(e) => handleChange("activityLevel", e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">-- Select --</option>
          <option value="sedentary">Sedentary</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        disabled={!dirty}
        onClick={handleSubmit}
        className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition ${
          dirty
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
