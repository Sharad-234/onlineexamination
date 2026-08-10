/**
 * App.jsx
 * 
 * Root component that defines the page routes.
 * - /              → Home page
 * - /register      → Registration form
 * - /success/:id   → Success page after submission
 * - /application/:id → Application details page
 */

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Success from './pages/Success';
import ApplicationDetails from './pages/ApplicationDetails';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/application/:id" element={<ApplicationDetails />} />
        </Routes>
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Examination Registration System. All rights reserved.
      </footer>
    </>
  );
}

export default App;
