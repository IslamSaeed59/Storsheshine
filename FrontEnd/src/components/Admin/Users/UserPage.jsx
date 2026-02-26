import { useEffect, useState } from "react";
import Header from "../../../Layout/Admin/Header";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { deleteUser, getUsers } from "../../../Services/api";
import UserTabel from "./UserTabel";
const UserPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const FethUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    FethUsers();
  }, []);
  const DeleteUsers = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter((product) => product.id !== userId));
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:");
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div>
      <Header
        title="User Management"
        buttonText="Add User"
        navigation="/admin/users/create"
      />
      <div className="mt-4">
        {loading ? (
          <RingLoader className="mx-auto" color="#cc1f69" />
        ) : (
          <UserTabel users={users} onDelete={DeleteUsers} />
        )}
      </div>
    </div>
  );
};

export default UserPage;
