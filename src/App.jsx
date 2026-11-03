import { Route, Routes } from 'react-router';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Doctors from './pages/Doctors.jsx';
import Booking from './pages/Booking.jsx';
import Appointments from './pages/Appointments.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
