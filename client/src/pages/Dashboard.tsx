import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // <-- start as true for desktop

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex bg-primary text-primary transition-colors">

      {/* Sidebar */}
      <DashSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* profile */}
      <div className={`flex-1 transition-all duration-300  ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {tab === "profile" && <DashProfile />}
         {/* posts... */}
      {tab === 'posts' && <DashPost />}
            {/* users */}
      {tab === 'users' && <DashUsers />}
      {/* comments  */}
      {tab === 'comments' && <DashComments />}
      {/* Dashcomp */}
      {tab === 'dash' && <DashboardComp />}
      </div>
    </div>
  );
}
