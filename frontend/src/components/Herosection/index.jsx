import React, { useState } from 'react';
import herosectionvideo from '../../assets/video/herosectionvideo.mp4';
import img1 from '../../assets/images/herosectionvideo.jpg';
import './CSS.css';

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div className='-mt-20 bg-transparent w-full h-[70vh] relative p-5'>
      {/* Background Video */}
      <video
        src={herosectionvideo}
        autoPlay
        loop
        muted
        className={`object-cover h-full w-full rounded-3xl border-4 border-white ${
          isVideoLoaded ? '' : 'hidden'
        }`}
        onLoadedData={() => setIsVideoLoaded(true)} // Updated event
        onError={() => setIsVideoLoaded(false)} // Handles video load failure
      />
      
      {/* Fallback Image */}
      <img
        src={img1}
        alt="Hero section"
        className={`object-cover h-full w-full rounded-3xl border-4 border-white ${
          isVideoLoaded && 'hidden'
        }`}
      />
    </div>
  );
};

export default HeroSection;
