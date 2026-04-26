import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browser from './pages/Browser'
import Detail from './pages/Detail'
import Post from './pages/Post'
import Services from './pages/Services'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'




function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/browser"      element={<Browser />} />
            <Route path="/listing/:id" element={<Detail />} />
            <Route path="/post"        element={<Post />} />
            <Route path="/services"    element={<Services />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/profile"     element={<Profile />} />
            <Route path="*"            element={<NotFound />} />
            // Routes mein add karo:
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/orders"       element={<Orders />} />
            <Route path="/dashboard" element={<Dashboard />} />
            // Routes mein add karo:
            <Route path="/forgot-password" element={<ForgotPassword />} />


          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App