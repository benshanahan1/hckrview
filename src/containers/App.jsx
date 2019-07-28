import React from 'react';
import Header from '../components/Header';
import News from './News';
import Footer from '../components/Footer';
import './App.css';


function App() {
  return (
    <div className="container">
      <Header />
      <News />
      <Footer />
    </div>
  );
}


export default App;
