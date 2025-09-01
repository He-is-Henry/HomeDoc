import { useAuth } from "../hooks/useAuth";
import axios from "../api/axios";
import { toast } from "react-toastify";

const SessionsModal = ({ sessions, onClose, refresh }) => {
  const { accessToken } = useAuth();

  const handleRevoke = async (id) => {
    try {
      await axios.post("/auth/revoke", [id], {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success("Successfully revoked session");
      refresh();
      console.log("Refreshed");
    } catch (err) {
      toast.error("Could not revoke session");
      console.error("Error revoking session", err);
    }
  };

  const handleRevokeAll = async () => {
    const otherIds = sessions
      .filter((s) => s.accessToken !== accessToken)
      .map((s) => s._id);

    try {
      await axios.post("/auth/revoke", otherIds, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      refresh();
    } catch (err) {
      console.error("Error logging out all other devices", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-white p-4 shadow-xl rounded-t-2xl overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Logged-in Devices</h2>
        <button onClick={onClose} className="text-gray-600 text-xl">
          ✖
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div
            key={s._id}
            className="border p-3 rounded shadow-sm bg-gray-50 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{s.device}</div>
              <div className="text-sm text-gray-500">
                {s.location} — {s.ipAddress}
              </div>{" "}
              <div className="text-xs text-gray-400">
                First Login: {new Date(s.createdAt).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                Last used: {new Date(s.lastUsed).toLocaleString()}
              </div>
            </div>

            {s.accessToken !== accessToken && (
              <button
                onClick={() => handleRevoke(s._id)}
                className="text-red-500 text-sm"
              >
                Log out
              </button>
            )}
          </div>
        ))}
      </div>

      {sessions.length && (
        <button
          onClick={handleRevokeAll}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded"
        >
          Log out all other devices
        </button>
      )}
    </div>
  );
};

export default SessionsModal;
