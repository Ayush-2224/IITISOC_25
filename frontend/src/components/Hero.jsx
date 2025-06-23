import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);
  const heroTexts = [
    "Plan the Perfect Movie Night 🎬",
    "Watch Together, Wherever You Are 🌟", 
    "Discover Your Next Favorite Film 🎭"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/50 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599685831-5d8bd42c6c6d?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce text-6xl opacity-30">🎬</div>
        <div className="absolute top-40 right-20 animate-pulse text-4xl opacity-30">🍿</div>
        <div className="absolute bottom-32 left-20 animate-bounce text-5xl opacity-30 delay-1000">🎭</div>
        <div className="absolute bottom-20 right-32 animate-pulse text-4xl opacity-30 delay-500">🎪</div>
        <div className="absolute top-1/3 left-1/4 animate-bounce text-3xl opacity-20 delay-700">⭐</div>
        <div className="absolute top-2/3 right-1/4 animate-pulse text-3xl opacity-20 delay-300">🎯</div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Main Heading with Animation */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 min-h-[200px] md:min-h-[240px] flex items-center justify-center">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in">
              {heroTexts[currentText]}
            </span>
          </h1>
          <div className="flex justify-center space-x-2 mb-6">
            {heroTexts.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentText 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Create groups, invite friends, discover amazing movies, and make every night 
          a <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">perfect movie night</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
          <Link
            to="/signup"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>🚀 Get Started Free</span>
            </span>
          </Link>
          
          <Link
            to="/explore"
            className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🎬 Explore Movies</span>
            </span>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Create Groups</h3>
            <p className="text-gray-400">Invite friends and family to join your movie nights</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Picks</h3>
            <p className="text-gray-400">AI-powered recommendations based on your group's taste</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
            <p className="text-gray-400">Plan, discuss, and vote together in real-time</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">1000+</div>
            <div className="text-gray-400 text-sm">Movies Watched</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">50+</div>
            <div className="text-gray-400 text-sm">Active Groups</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text">500+</div>
            <div className="text-gray-400 text-sm">Movie Nights</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">24/7</div>
            <div className="text-gray-400 text-sm">Available</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
