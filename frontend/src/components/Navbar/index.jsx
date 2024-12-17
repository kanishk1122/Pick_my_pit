import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import { gsap } from "gsap";
import { useUser } from "../../utils/Usercontext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../../utils/Customswal";
import Cookies from "js-cookie";

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
    console.log(Cookies.get("Userdata"));
  }, [Cookies.get("Userdata") || user]);

  return (
    <div className=" h-24 px-10 w-screen pt-3 sticky top-0 z-50 ">
      <nav
        className="nav h-full   transition-all duration-500 rounded-full  "
        ref={navRef}
      >
        <div className="flex justify-between items-center py-4 h-full relative ">
          <Link
            to="/"
            className="flex items-center space-x-2 bg-zinc-300/50  px-3 ml-4 rounded-full py-2 backdrop-blur-3xl"
          >
            <img src={Logo} alt="Logo" className="w-10 h-10 ml-2" />
            <h1 className="text-2xl font-bold text-[#2c2c2c]">PetShop</h1>
          </Link>

          <div className="bg-transparent  flex  rounded-3xl  justify-between items-center  ">
            <ul
              className="flex space-x-8 text-3xl font-semibold text-[#2c2c2c] px-4 rounded-full  items-center justify-between   backdrop-blur-md"
              ref={menuRef}
            >
              {["Home", "About", "Services"].map((item, index) => (
                <li
                  key={index}
                  ref={(el) => (menuItemsRef.current[index] = el)}
                >
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-[#2c2c2c] hover:text-[#1a1a1a] transition-colors duration-300 text-center"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li ref={(el) => (menuItemsRef.current[5] = el)}>
                <button
                  onClick={() => {
                    if (!user && !Cookies.get("Userdata")) {
                      navigate("/auth");
                    }
                    // Do something when user is logged in
                  }}
                  className="relative text-[#2c2c2c] hover:text-[#1a1a1a] transition-colors duration-300  flex items-center justify-center text-center"
                >
                  {/* {Cookies.get('Userdata')? <Menu /> : 'Login'} */}
                  {!user && userdete == undefined ? "Login" : <Menu />}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;

const Menu = () => {
  const Swal = useSwal();
  const { user, setUser } = useUser();
  const [showmenu, setshowmenu] = useState(false);
  useEffect(() => {
    console.log(Cookies.get("Userdata"));
  }, [Cookies.get("Userdata") || user]);

  return (
    <div className="flex flex-col items-center justify-center">
      {showmenu && (
        <button
          onClick={()=>setshowmenu(false)}
          className="fixed bg-transparent  w-[100em] h-[100em]"
        ></button>
      )}
      <button onClick={() => setshowmenu(!showmenu)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
        </svg>
      </button>
      <div className="absolute text-lg right-0 top-10">
        <div
          className={`bg-white ${
            !showmenu ? "w-0 h-0 " : "w-40 h-24  border-2 border-black"
          } flex flex-col justify-between items-center rounded-3xl shadow-lg overflow-hidden duration-300 `}
        >
          <ul>
            <li>
              <Link to={"user"}>Profile</Link>
            </li>
            <li>Settings</li>
            <li>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You want to logout",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Logout",
                    cancelButtonText: "No, cancel!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Cookies.remove("Userdata");
                      Swal.fire({
                        title: "Logged out",
                        icon: "success",
                        text: "You have been logged out.",
                      }).then(() => {
                        // window.location.reload();
                      });
                      setUser();
                      setshowmenu(false);
                    }
                  });
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* <img src={user?.userpic} height={`50px`} width={`50px`} alt="" className='rounded-full ' /> */}
    </div>
  );
};
