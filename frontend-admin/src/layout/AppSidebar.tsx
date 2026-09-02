import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PageIcon,
  TiketIcon,
  UserIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <TiketIcon />,
    name: "Semua Tiket",
    path: "/tiket",
  },
  {
    name: "Master Data",
    icon: <PageIcon />,
    path: "/master-data",
  },
  {
    name: "Akun Agent",
    icon: <UserIcon />,
    path: "/akun-agent",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  // 2. Ambil data dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const storedAgent = localStorage.getItem("agent_info");
    if (storedAgent) {
      try {
        const parsedAgent = JSON.parse(storedAgent);
        setUserInfo({
          // Sesuaikan 'nama' atau 'name' tergantung dari respons backend Anda
          name: parsedAgent.nama || parsedAgent.name || "Admin KKP",
          email: parsedAgent.email || "admin@kkp.go.id"
        });
      } catch (error) {
        console.error("Gagal membaca data sesi", error);
      }
    }
  }, []);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#113E65] dark:bg-gray-900 dark:border-gray-800 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-6 flex flex-col items-center text-center">
        <Link to="/" className="flex flex-col items-center">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden bg-white p-3 rounded-2xl"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={120}
                height={30}
              />
              <img
                className="hidden dark:block bg-white p-3 rounded-2xl"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={120}
                height={30}
              />
              {/* Tambahan Teks di bawah logo */}
              <div className="mt-2">
                <h4 className="text-base font-bold text-white">
                  KKP Helpdesk
                </h4>
                <p className="text-[10px] font-medium uppercase text-blue-200 leading-relaxed">
                  Admin Panel
                </p>
              </div>
            </>
          ) : (
            <img
              className="bg-white rounded-3xl p-1"
              src="/images/logo/kkp.svg"
              alt="Logo"
              width={56}
              height={56}
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
      <div className={`mt-auto border-t border-[#1e507b] p-4 ${!isExpanded && !isHovered && !isMobileOpen ? 'hidden' : 'block'}`}>
        <span className="block font-medium text-white text-theme-sm dark:text-gray-400 truncate">
          {userInfo.name}
        </span>
        <span className="mt-0.5 block text-theme-xs text-blue-200 dark:text-gray-400 truncate">
          {userInfo.email}
        </span>
      </div>
    </aside>
  );
};

export default AppSidebar;
