import React from "react";
import pet1 from "../assets/images/pet1.png";
import pet2 from "../assets/images/pet2.png";
import pet3 from "../assets/images/pet3.png";
import './Deafultpage.css'

const Deafultpage = () => {


  //todo : make link for each card and there components
  const data = [
    {
      id: 1,
      heading: "Give your pet to another home",
      subheading:
        "Find a loving home for your pet and give them a second chance at happiness. Adopt and save a life.",
      img: pet1,
    },
    {
      id: 2,
      heading: "Discover a Loyal Friend",
      subheading:
        "We assist you in finding the perfect pet to join your family. Make a difference, adopt today.",
      img: pet2,
    },
    {
      id: 3,
      heading: "Donate for a Cause",
      subheading:
        "Help us in our mission to save animals in need. Your donation will help us provide food, shelter, and medical care.",
      img: pet3,
    },
  ];

  return (
    <div className="main pt-3 h-fit min-h-screen flex justify-around items-start ">
      {data.map((item) => (
        <div
          key={item.id}
          className="h-fit min-h-[80vh] w-[278px] cursor-pointer bg-white/30 backdrop-blur-lg hover:shadow-2xl  rounded-2xl  flex justify-start py-12 gap-10 items-center flex-col mt-10  hover:scale-105 transition-transform duration-500"
        >
          <img
            src={item.img}
            className="size-[200px]   h-full object-cover"
            alt=""
          />
          <div className="flex flex-col gap-4 items-center px-6 text-center">
            <h1 className="text-2xl text-[#384141]">
              {item.heading}
            </h1>
            <p className="text-xs text-[#384141]">
              {item.subheading}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Deafultpage;
