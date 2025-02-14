import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import { gsap } from "gsap";
import { useUser } from "../../utils/Usercontext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../../utils/Customswal";
import Cookies from "js-cookie";

// Add SVG Icon Components
const NavIcons = {
  Post: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3M19,19H5V5H19V19M17,17H7V7H17V17Z"/>
    </svg>
  ),
  About: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
    </svg>
  ),
  Services: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,5.5A2.5,2.5 0 0,1 14.5,8A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 9.5,8A2.5,2.5 0 0,1 12,5.5M5,8A2.5,2.5 0 0,1 7.5,10.5A2.5,2.5 0 0,1 5,13A2.5,2.5 0 0,1 2.5,10.5A2.5,2.5 0 0,1 5,8M19,8A2.5,2.5 0 0,1 21.5,10.5A2.5,2.5 0 0,1 19,13A2.5,2.5 0 0,1 16.5,10.5A2.5,2.5 0 0,1 19,8M12,13A2.5,2.5 0 0,1 14.5,15.5A2.5,2.5 0 0,1 12,18A2.5,2.5 0 0,1 9.5,15.5A2.5,2.5 0 0,1 12,13Z"/>
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
    </svg>
  )
};

const Index = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const { user } = useUser();
  const [userdete, setuserdete] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("Userdata")) {
      setuserdete(Cookies.get("Userdata"));
    } else {
      setuserdete();
    }
  }, [Cookies.get("Userdata") || user]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: navRef.current,
      start: "top top",
      end: "+=500",
      onEnter: () => {
        // Apply the backdrop-filter and other styles on scroll down
        gsap.to(navRef.current, {
          backgroundColor: "transparent",
          duration: 0.2,
          marginTop: `-${30}px`,
          color: "white",
          padding: "0 0px",
          height: "60px",
          ease: "power3.out", // Set the desired blur
        });
        gsap.to(menuRef.current, {
          backdropFilter: "none",
          duration: 0.2,
          ease: "power3.out",
        });
      },
      onLeaveBack: () => {
        // Reset styles when scrolling back up
        gsap.to(navRef.current, {
          backgroundColor: "transparent",
          duration: 0.2,
          marginTop: 0,
          ease: "power3.out",
          backdropFilter: "none",
        });

        gsap.to(menuRef.current, {
          backdropFilter: "blur(50px)", // Apply blur effect
          duration: 0.2,
          ease: "power3.out",
        });
      },
    });

    // Logo entrance animation
    gsap.from(logoRef.current, {
      duration: 1,
      y: -100,
      opacity: 1,
      ease: "power3.out",
    });

    // Menu item entrance animations
    menuItemsRef.current.forEach((item) => {
      gsap.from(item, {
        duration: 1,
        y: -50,
        opacity: 0, // Start invisible for better entrance effect
        ease: "power3.out",
      });

      gsap.to(item, {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      scrollTriggerInstance.kill();
    };
  }, [Cookies.get("Userdata") || user]);

  useEffect(() => {
    // console.log(Cookies.get("Userdata"));
  }, [Cookies.get("Userdata") || user]);

  return (
    <div className="h-24 px-5 md:px-10 w-screen pt-3 sticky top-0 z-50 ">
      <nav className="nav  " ref={navRef}>
        <div className="flex justify-between items-center py-4 h-full relative px-6">
          <Link to="/" className="flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 rounded-2xl py-2.5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <img src={Logo} alt="Logo" className="w-8 h-8 drop-shadow-xl animate-pulse" />
            <h1 className="text-xl font-bold text-white hidden sm:block">Pick My Pet</h1>
          </Link>

          <div className="flex items-center gap-6">
            <ul className="hidden md:flex items-center space-x-2 text-base font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30" ref={menuRef}>
              {[
                { route: "create-post", name: "Post", Icon: NavIcons.Post, color: "hover:text-indigo-600" },
                { route: "about", name: "About Us", Icon: NavIcons.About, color: "hover:text-violet-600" },
                { route: "services", name: "Services", Icon: NavIcons.Services, color: "hover:text-purple-600" }
              ].map((item, index) => (
                <li key={index} ref={(el) => (menuItemsRef.current[index] = el)}>
                  <Link
                    to={`/${item.route}`}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 ${item.color}`}
                  >
                    <item.Icon />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (!user && !Cookies.get("Userdata")) {
                  navigate("/auth");
                }
              }}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 text-white hover:scale-105"
            >
              {!user && userdete == undefined ? (
                <>
                  <NavIcons.Lock />
                  <span>Login</span>
                </>
              ) : (
                <Menu />
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

const Menu = () => {
  const Swal = useSwal();
  const { user, setUser } = useUser();
  const [showmenu, setshowmenu] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setshowmenu(!showmenu)}
        className="flex items-center gap-3 hover:opacity-90 rounded-xl transition-all duration-300"
      >
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm hover:scale-105 transition-transform">
          <NavIcons.User />
        </div>
        <svg className={`w-4 h-4 transition-transform duration-300 text-white ${showmenu ? 'rotate-180' : ''}`} viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 10l5 5 5-5H7z"/>
        </svg>
      </button>

      {showmenu && (
        <>
          <div className="fixed inset-0" onClick={() => setshowmenu(false)} />
          <div className="absolute right-0 top-14 w-56 bg-gradient-to-b from-indigo-600/10 to-violet-600/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300">
            <div className="py-3 px-2 space-y-1">
              <Link to="/user" className="menu-item group">
                <NavIcons.User className="transform transition-transform group-hover:scale-110" />
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="menu-item group">
                <NavIcons.Settings className="transform transition-transform group-hover:rotate-90" />
                <span>Settings</span>
              </Link>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Ready to leave?",
                    text: "You will be logged out",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, logout",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#ef4444",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Cookies.remove("Userdata");
                      setUser();
                      setshowmenu(false);
                      Swal.fire("Logged out!", "Come back soon!", "success");
                    }
                  });
                }}
                className="menu-item group text-red-500 hover:bg-red-500/10 w-full"
              >
                <NavIcons.Logout className="transition-transform group-hover:-translate-x-1" />
                <span className="transition-transform group-hover:translate-x-1">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;

// Add this CSS to your global styles or as a styled component
const styles = `
.menu-item {
  @apply flex items-center gap-3 px-4 py-3 text-sm w-full transition-all duration-200 rounded-xl text-gray-700;
  @apply hover:bg-white/20 hover:shadow-sm backdrop-blur-sm;
  @apply hover:scale-105 transform transition-transform;
}
`;
