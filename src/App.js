// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ImageGenerationPage from './components/ImageGenerationPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<ImageGenerationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
