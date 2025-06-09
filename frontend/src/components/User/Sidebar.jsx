import React from "react";
import { Link, useNavigate } from "react-router-dom";


const data = [
  {
    title: "Personal info",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
      >
        <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path>
      </svg>
    ),
    link: "/user/",
  },
  // {
  //   title: "Email & Password",
  //   icon: (
  //     <svg

  //       xmlns="http://www.w3.org/2000/svg"
  //       viewBox="0 0 24 24"
  //       width="24px"
  //       height="24px"
  //     >
  //        <path d="M 6 3 C 4.3550302 3 3 4.3550302 3 6 L 3 8 A 1.0001 1.0001 0 1 0 5 8 L 5 6 C 5 5.4349698 5.4349698 5 6 5 L 8 5 A 1.0001 1.0001 0 1 0 8 3 L 6 3 z M 16 3 A 1.0001 1.0001 0 1 0 16 5 L 18 5 C 18.56503 5 19 5.4349698 19 6 L 19 8 A 1.0001 1.0001 0 1 0 21 8 L 21 6 C 21 4.3550302 19.64497 3 18 3 L 16 3 z M 11.984375 5.9863281 A 1.0001 1.0001 0 0 0 11 7 L 11 17 A 1.0001 1.0001 0 1 0 13 17 L 13 7 A 1.0001 1.0001 0 0 0 11.984375 5.9863281 z M 7.984375 8.9863281 A 1.0001 1.0001 0 0 0 7 10 L 7 14 A 1.0001 1.0001 0 1 0 9 14 L 9 10 A 1.0001 1.0001 0 0 0 7.984375 8.9863281 z M 15.984375 8.9863281 A 1.0001 1.0001 0 0 0 15 10 L 15 14 A 1.0001 1.0001 0 1 0 17 14 L 17 10 A 1.0001 1.0001 0 0 0 15.984375 8.9863281 z M 3.984375 14.986328 A 1.0001 1.0001 0 0 0 3 16 L 3 18 C 3 19.64497 4.3550302 21 6 21 L 8 21 A 1.0001 1.0001 0 1 0 8 19 L 6 19 C 5.4349698 19 5 18.56503 5 18 L 5 16 A 1.0001 1.0001 0 0 0 3.984375 14.986328 z M 19.984375 14.986328 A 1.0001 1.0001 0 0 0 19 16 L 19 18 C 19 18.56503 18.56503 19 18 19 L 16 19 A 1.0001 1.0001 0 1 0 16 21 L 18 21 C 19.64497 21 21 19.64497 21 18 L 21 16 A 1.0001 1.0001 0 0 0 19.984375 14.986328 z" />
  //        </svg>
  //     ),
  //   link: "security",
  // },
  {
    title: "Update Profile",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
      >
        <path d="M19.29,2.265l2.444,2.444L14.444,12H12V9.556L19.29,2.265z M21.377,0.179l-1.222,1.222l2.444,2.444l1.222-1.222c0.239-0.239,0.239-0.626,0-0.864l-1.58-1.58C22.002-0.06,21.615-0.06,21.377,0.179z" />
        <path d="M19.001,10.272L19.002,19H5V9h4.728l2-2H5V5h8.728l2-2H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V8.272L19.001,10.272z" />
        <path d="M14.732 4L4 4 4 8 10.732 8z" opacity=".3" />
      </svg>
    ),
    link: "setting",
  },
  {
    title: "Add Address",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
      >
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2V6C22 4.9 21.1 4 20 4zM20 18H4V6h16V18z"></path>
        <path d="M12 8c-1.1 0-2 0.9-2 2s0.9 2 2 2s2-0.9 2-2S13.1 8 12 8zM12 11c-0.6 0-1-0.4-1-1s0.4-1 1-1s1 0.4 1 1S12.6 11 12 11z"></path>
      </svg>
    ),
    link: "address",
  },
  {
    title: "My Posts",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ),
    link: "posts",
  },
  {
    title: "My Referal",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a1 1 0 112 0v3a1 1 0 11-2 0V9a1 1 0 011-1h3a1 1 0 110 2H9a1 1 0 01-1-1z" />
      </svg>
    ),
    link: "refer",
  }
];


const Sidebar = () => {
  const Navigate = useNavigate();
  return (
    <div className="w-[260px] h-full pt-10 min-h-screen">
      <ul className="w-full justify-center items-center flex flex-col  gap-4 mt-2 *:py-2 *:w-full px-3 *:rounded-xl text-center">
        {data.map((item, index) => (
            <ol key={item.title} className="">
            <button onClick={()=>Navigate(`${item.link}`)} className=" brand-button w-full h-full  flex justify-center gap-3 items-center">
              {" "}
             {item.icon}
              <span>{item.title}</span>
            </button>
          </ol>
        ))}
        {/* <ol><button className=' brand-button w-full h-full'>demo</button></ol> */}
      </ul>
    </div>
  );
};

export default Sidebar;
