import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth();

  // Otomatis menutup sidebar jika layar < 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize(); // cek saat pertama kali load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex mr-3 bg-white fixed top-0">
      {/* sidebar utama */}
      <div className={`transition-all duration-300 flex flex-col justify-between shadow-xl h-screen ${open ? "w-64 md:w-72" : "w-0 overflow-hidden"}`}>
        <div className="p-4">
          <Link to="/">
            <div className="pb-8 pt-1 flex items-center cursor-pointer">
              <div className="pr-3">
                <img className="w-7 h-7" src="/h.png" alt="logo-Hero" />
              </div>
              <p className="text-2xl m-0 font-bold pl-3 border-l border-l-gray-400">Busana</p>
            </div>
          </Link>
          <div className="p-4 mb-8 border rounded">
            <p className="text-gray-600 text-sm">
              Welcome, <span className="font-semibold">{user?.username || "User123"}</span>
            </p>
          </div>
          <nav className="flex flex-col gap-1 text-base">
            <Link to="/" className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition">
              <GoHome size={20} />
              Home
            </Link>
            <Link to="/task" className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition">
              <FaPlus size={20} />
              Create Task
            </Link>
            <Link to="/dashboard" className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition">
              <RxDashboard size={20} />
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="p-4">
          <div className="pb-5 border-t"></div>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-5 w-full rounded-lg text-red-600 hover:bg-red-100 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* tombol toggle sidebar */}
      <button onClick={() => setOpen(!open)} className="px-1.5 border-none py-1 my-4 m-2 h-fit text-gray-600 bg-white rounded-lg">
        <Menu width={20} height={20} />
      </button>
    </div>
  );
};

export default Sidebar;
