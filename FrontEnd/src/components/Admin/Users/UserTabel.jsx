import { useState } from "react";
import { Pencil, Trash2, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateEmployee } from "../../../Services/api";

const EmployeeEditModal = ({ user, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      DOH: user.employee.DOH
        ? new Date(user.employee.DOH).toISOString().split("T")[0]
        : "",
      salary: user.employee.salary,
      isWorking: user.employee.isWorking,
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateEmployee(user.employee._id, data);
      toast.success("Employee details updated successfully!");
      onSave(); // This will trigger a refresh in the parent component
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update employee.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Edit Employee: {user.name}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700"
            >
              Salary
            </label>
            <input
              id="salary"
              type="number"
              {...register("salary")}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex items-center">
            <input
              id="isWorking"
              type="checkbox"
              {...register("isWorking")}
              className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label
              htmlFor="isWorking"
              className="ml-2 block text-sm text-gray-900"
            >
              Is Currently Working
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#cc1f69] hover:bg-[#a91853] text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors disabled:bg-pink-300"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserTabel = ({ users, onDelete }) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRowClick = (user) => {
    if (user.role === "employee" && user.employee) {
      setSelectedUser(user);
    } else {
      // Optional: navigate to a general user details page if not an employee
      // navigate(`/admin/users/${user.id}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSave = () => {
    setSelectedUser(null);
    // We need a way to refresh the user list. The parent component (UserPage.jsx)
    // should handle this. For now, we can just close the modal.
    // A more robust solution would be to pass a refresh function from the parent.
    window.location.reload(); // Simple but effective way to see changes
  };

  return (
    <div>
      {selectedUser && (
        <EmployeeEditModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      <div className="bg-white rounded-xl shadow-md overflow-hidden m-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                User
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Phone
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Address
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Role
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Joined At
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(user)}
              >
                <td className="text-left py-3 px-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="text-left py-3 px-4">{user.phone}</td>
                <td className="text-left py-3 px-4">{user.profile?.Address}</td>
                <td className="text-left py-3 px-4">
                  <span
                    className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-pink-200 text-pink-800"
                        : user.role === "user"
                          ? "bg-green-200 text-green-800"
                          : user.role === "employee"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="text-left py-3 px-4">
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  <p>{new Date(user.createdAt).toLocaleTimeString()}</p>
                </td>
                <td className="text-left py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/users/update/${user._id}`);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        navigate(`/admin/profiles/update/${user.profile._id}`);
                      }}
                      className="text-green-500 hover:text-green-700 transition-colors"
                    >
                      <UserCog size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user._id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTabel;
