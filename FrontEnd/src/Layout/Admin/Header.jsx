// Header.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ title, buttonText, showButton = true, navigation }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white rounded-xl  shadow-md m-4 p-5 border-b border-gray-200`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>

        {showButton && (
          <button
            type="button"
            onClick={() => navigate(navigation)}
            aria-label={buttonText}
            className="bg-[#cc1f69] hover:bg-[#a91853] text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc1f69]"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
