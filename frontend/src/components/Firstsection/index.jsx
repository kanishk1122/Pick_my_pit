import React from 'react';
import Card from './Card.jsx';
import nd1 from '../../assets/images/normat_dog.png';
import nd2 from '../../assets/images/normal_dog_2.png';

const PawIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,5.5A2.5,2.5 0 0,1 14.5,8A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 9.5,8A2.5,2.5 0 0,1 12,5.5M5,8A2.5,2.5 0 0,1 7.5,10.5A2.5,2.5 0 0,1 5,13A2.5,2.5 0 0,1 2.5,10.5A2.5,2.5 0 0,1 5,8M19,8A2.5,2.5 0 0,1 21.5,10.5A2.5,2.5 0 0,1 19,13A2.5,2.5 0 0,1 16.5,10.5A2.5,2.5 0 0,1 19,8M12,13A2.5,2.5 0 0,1 14.5,15.5A2.5,2.5 0 0,1 12,18A2.5,2.5 0 0,1 9.5,15.5A2.5,2.5 0 0,1 12,13Z"/>
  </svg>
);

const HomeIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
);

const Index = () => {
  return (
    <div className="container mx-auto px-5 my-16">
      <div className="text-center mb-16">
        <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-700 text-sm font-medium px-6 py-2.5 rounded-2xl inline-flex items-center gap-2 shadow-xl">
          <PawIcon /> Find Your Perfect Match
        </span>
        <h1 className="text-6xl font-bold mt-6 mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Where Pet Love Stories Begin
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join thousands of happy families who've found their perfect companions through our platform
        </p>
      </div>

      {/* Stats Section with Glassmorphism */}
      <div className="flex justify-center gap-8 mb-16">
        {[
          { number: "5000+", label: "Pets Adopted", icon: <PawIcon /> },
          { number: "10k+", label: "Happy Families", icon: <HeartIcon /> },
          { number: "98%", label: "Success Rate", icon: <HomeIcon /> }
        ].map((stat, index) => (
          <div key={index} className="text-center flex flex-col justify-center items-center bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20">
            <div className="text-[#4481EB] mb-2 w-fit">{stat.icon}</div>
            <div className="text-3xl font-bold text-[#4481EB]">{stat.number}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-evenly gap-8 items-stretch">
        {/* Adopt Section */}
        <div className="bg-gradient-to-br from-purple-500/80 to-blue-500/80 rounded-[2.5rem] border border-white/20 shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 backdrop-blur-xl">
          <div className="bg-white/20 p-4 rounded-2xl">
            <HomeIcon />
          </div>
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-6 py-2 rounded-full mb-4 flex items-center gap-2">
            <PawIcon /> Give a Home
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Adopt a Friend</h2>
          <p className="text-lg text-white/90 mb-6">
            Every adoption saves two lives - the pet you adopt and the one who takes their place. Start your journey of love today.
          </p>
          <button className="group relative mt-auto bg-white text-[#4481EB] font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-[#f8f9fa] hover:shadow-lg w-full flex items-center justify-center gap-2">
            Find Your Match
            <ArrowIcon />
          </button>
          <img src={nd1} className="mt-6 w-36 h-36 object-cover rounded-full shadow-lg border-4 border-white" alt="A friendly dog available for adoption" />
        </div>

        {/* Buy/Sell Section */}
        <div className="bg-gradient-to-br from-orange-400/80 to-pink-500/80 rounded-[2.5rem] border border-white/20 shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 backdrop-blur-xl">
          <div className="bg-white/20 p-4 rounded-2xl">
            <HeartIcon />
          </div>
          <div className="bg-orange-100 text-orange-800 text-xs font-medium px-6 py-2 rounded-full mb-4 flex items-center gap-2">
            <PawIcon /> Connect Hearts
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Buy or Rehome</h2>
          <p className="text-lg text-white/90 mb-6">
            Whether you're expanding your family or helping a pet find their forever home, we ensure safe and loving transitions.
          </p>
          <button className="group relative mt-auto bg-white text-[#FFB347] font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-[#f8f9fa] hover:shadow-lg w-full flex items-center justify-center gap-2">
            Explore Options
            <ArrowIcon />
          </button>
          <img src={nd2} className="mt-6 w-36 h-36 object-cover rounded-full shadow-lg border-4 border-white" alt="A cute dog for sale" />
        </div>
      </div>
    </div>
  );
};

export default Index;
