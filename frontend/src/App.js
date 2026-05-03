import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import InstallPrompt from './components/InstallPrompt'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Post from './pages/Post'
import Services from './pages/Services'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import ForgotPassword from './pages/ForgotPassword'
import Chat from './pages/Chat'
import Browse from './pages/Browse'  // ← sahi
import Conversations from './pages/Conversations'
import Rentals from './pages/Rentals'



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/browse"            element={<Browse />} />
            <Route path="/listing/:id"       element={<Detail />} />
            <Route path="/post"              element={<Post />} />
            <Route path="/services"          element={<Services />} />
            <Route path="/login"             element={<Login />} />
            <Route path="/register"          element={<Register />} />
            <Route path="/profile"           element={<Profile />} />
            <Route path="/dashboard"         element={<Dashboard />} />
            <Route path="/checkout/:id"      element={<Checkout />} />
            <Route path="/orders"            element={<Orders />} />
            <Route path="/forgot-password"   element={<ForgotPassword />} />
            <Route path="/chat/:roomId"      element={<Chat />} />
            <Route path="/messages"          element={<Conversations />} />
            <Route path="*"                  element={<NotFound />} />  
            // Routes mein:
            <Route path="/rentals" element={<Rentals />} />
          </Routes>
        </div>
        <InstallPrompt />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App