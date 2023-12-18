import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";
import axios from "axios"; // Import Axios

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/users/logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Button
      position="fixed"
      top="30px"
      right="30px"
      size="sm"
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
