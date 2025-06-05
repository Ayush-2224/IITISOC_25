import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";

const HeroSection = () => {

 
  return (
    <section className="relative bg-black text-white min-h-[calc(100vh-50px)] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601980927700-9710ea71cebb?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-30"></div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Plan the Perfect Movie Night 🎬
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8">
          Invite friends, pick movies, schedule times – all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Get Started
          </a>
          <a
            href="/explore"
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition"
          >
            Explore Movies
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
