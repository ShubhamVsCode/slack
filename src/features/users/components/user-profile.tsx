import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";

interface UserProfileProps {
  userId: Id<"users">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, open, setOpen }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p>User ID: {userId}</p>
        <button
          onClick={() => setOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
