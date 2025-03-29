
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Users, FileText, Settings, Menu } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <h1 className="text-xl font-semibold">Resume Analyzer</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-700"
        >
          {collapsed ? <Menu /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        <NavItem icon={<Home size={20} />} label="Dashboard" collapsed={collapsed} active />
        {/* <NavItem icon={<FileText size={20} />} label="Resumes" collapsed={collapsed} />
        <NavItem icon={<Users size={20} />} label="Candidates" collapsed={collapsed} />
        <NavItem icon={<Settings size={20} />} label="Settings" collapsed={collapsed} /> */}
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
}

const NavItem = ({ icon, label, collapsed, active = false }: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-white hover:bg-gray-700",
        active && "bg-gray-700",
        collapsed ? "px-2" : "px-4"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        {!collapsed && <span>{label}</span>}
      </div>
    </Button>
  );
};

export default Sidebar;
