import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Sidebar = () => {
  const Navigate = useNavigate();
  return (
    <div className="w-[260px] h-full pt-10 min-h-screen">
      <ul className="w-full justify-center items-center flex flex-col  gap-4 mt-2 *:py-2 *:w-full px-3 *:rounded-xl text-center">
        <ol>
          <button onClick={()=>Navigate("/user/")} className=" brand-button w-full h-full  flex justify-center gap-3 items-center">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path>
            </svg>{" "}
            <span>Personal info</span>
          </button>
        </ol>
        <ol>
          <button 
          onClick={()=>Navigate("security")}
           className=" brand-button w-full h-full  flex justify-center gap-3 items-center">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
            >
              <path d="M 6 3 C 4.3550302 3 3 4.3550302 3 6 L 3 8 A 1.0001 1.0001 0 1 0 5 8 L 5 6 C 5 5.4349698 5.4349698 5 6 5 L 8 5 A 1.0001 1.0001 0 1 0 8 3 L 6 3 z M 16 3 A 1.0001 1.0001 0 1 0 16 5 L 18 5 C 18.56503 5 19 5.4349698 19 6 L 19 8 A 1.0001 1.0001 0 1 0 21 8 L 21 6 C 21 4.3550302 19.64497 3 18 3 L 16 3 z M 11.984375 5.9863281 A 1.0001 1.0001 0 0 0 11 7 L 11 17 A 1.0001 1.0001 0 1 0 13 17 L 13 7 A 1.0001 1.0001 0 0 0 11.984375 5.9863281 z M 7.984375 8.9863281 A 1.0001 1.0001 0 0 0 7 10 L 7 14 A 1.0001 1.0001 0 1 0 9 14 L 9 10 A 1.0001 1.0001 0 0 0 7.984375 8.9863281 z M 15.984375 8.9863281 A 1.0001 1.0001 0 0 0 15 10 L 15 14 A 1.0001 1.0001 0 1 0 17 14 L 17 10 A 1.0001 1.0001 0 0 0 15.984375 8.9863281 z M 3.984375 14.986328 A 1.0001 1.0001 0 0 0 3 16 L 3 18 C 3 19.64497 4.3550302 21 6 21 L 8 21 A 1.0001 1.0001 0 1 0 8 19 L 6 19 C 5.4349698 19 5 18.56503 5 18 L 5 16 A 1.0001 1.0001 0 0 0 3.984375 14.986328 z M 19.984375 14.986328 A 1.0001 1.0001 0 0 0 19 16 L 19 18 C 19 18.56503 18.56503 19 18 19 L 16 19 A 1.0001 1.0001 0 1 0 16 21 L 18 21 C 19.64497 21 21 19.64497 21 18 L 21 16 A 1.0001 1.0001 0 0 0 19.984375 14.986328 z" />
            </svg>{" "}
            <span>Email & Password</span>
          </button>
        </ol>
        <ol>
          <button onClick={()=>Navigate("setting")} className=" brand-button w-full h-full  flex justify-center gap-3 items-center">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
            >
              <path d="M19.29,2.265l2.444,2.444L14.444,12H12V9.556L19.29,2.265z M21.377,0.179l-1.222,1.222l2.444,2.444l1.222-1.222c0.239-0.239,0.239-0.626,0-0.864l-1.58-1.58C22.002-0.06,21.615-0.06,21.377,0.179z" />
              <path d="M19.001,10.272L19.002,19H5V9h4.728l2-2H5V5h8.728l2-2H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V8.272L19.001,10.272z" />
              <path d="M14.732 4L4 4 4 8 10.732 8z" opacity=".3" />
            </svg>{" "}
            <span>Update Profile</span>
          </button>
        </ol>
        {/* <ol><button className=' brand-button w-full h-full'>demo</button></ol> */}
      </ul>
    </div>
  );
};

export default Sidebar;
