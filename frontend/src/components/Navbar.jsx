import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = ({ open }) => {
  const { user, logout } = useAuth();
  const [openPopup, setOpenPopup] = useState(false);
  const popupRef = useRef();

  // menutup popup kalo klik di luar popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpenPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex justify-between items-center bg-white px-4 pr-9 h-16 fixed top-0 right-0 ${open ? "left-80" : "left-8"} z-10 transition-all duration-300`}>
      {/* Title */}
      <Link to={"/"} className="text-base">
        Home
      </Link>

      {/* Profile Logo */}
      <div className="relative">
        <img onClick={() => setOpenPopup(!openPopup)} className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300" src={"/default-profile.png"} alt="profile" />

        {/* Popup Profile user */}
        {openPopup && (
          <div ref={popupRef} className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border w-1/4 min-w-[200px]">
            <div className="p-4 border-b">
              <p className="font-semibold text-gray-800">{user?.username || "User"}</p>
            </div>
            <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
