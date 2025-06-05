import React from 'react'
import HeroSection from '../components/Hero'
import MovieCarousel from '../components/Trending'
import UpcomingMoviesCarousel from '../components/upcoming'
import NowPlayingCarousel from '../components/NowPlaying'
import Footer from '../components/Footer'


const Home = () => {
  return (
    <div>
      <HeroSection/>
      <MovieCarousel/>
      <UpcomingMoviesCarousel/>
      <NowPlayingCarousel/>
      <Footer/>
    </div>
  )
}

export default Home
