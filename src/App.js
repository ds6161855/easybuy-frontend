import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useEffect } from "react";
import i18n from "i18next";
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import ProductDetail from './component/ProductDetail';
import PaymentDashboard from './component/PaymentDashboard';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Orders from './component/Orders';
import MyProfile from './account/MyProfile';
import OrderDetail from './component/OrderDetail';
import WalletDashboard from './account/WalletDashboard';
import HelpChat from './account/HelpChat';
import SearchPage from './account/SearchPage';
import CartPage from './account/CartPage';
import BecomeSellerPage from './auth/BecomeSellerPage';
import PageLayout from './components/PageLayout';
import NotificationPreferences from './pages/NotificationPreferences';
import Advertise from './pages/Advertise';
import CustomerCare from './pages/CustomerCare';
import DownloadApp from './pages/DownloadApp';
import Terms from './pages/Terms';
import Language from './pages/Language';
import Privacy from './pages/Privacy';
import SellerKycPage from './auth/SellerKycPage';
import SellerDashboardPage from './auth/SellerDashboardPage';
import SellerLoginPage from './auth/SellerLoginPage';
import Footer from './components/Footer';
import SellerNavbar from './components/SellerNavbar';


function App() {

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Page (Login/Register) */}
        
        <Route path="/login" element={<AuthPage />} />

        {/* Home Page */}
        <Route path="/" element={
          <>
            <Navbar />
            <HomePage />
          </>
        } />

        {/* Dashboard */}
        <Route path="/dashboard" element={
          <>
            <Navbar />
            <Dashboard />
          </>
        } />

        {/* Product Detail */}
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <ProductDetail />
          </>
        } />
        {/* Order Detail */}
        <Route path="/Order" element={
          <>
            <Navbar />
            <Orders />
          </>
        } />

        {/* Payment */}
        <Route path="/payment" element={
          <>
            <Navbar />
            <PaymentDashboard />
          </>
        } />

         {/* Seller Page */}
         <Route path="/seller/register" element={
          <>
              <SellerNavbar/>
              <BecomeSellerPage />
              <Footer/>
          </>
        } />

        {/* Seller Login Page */}
        <Route path="/seller/login" element={
          <>
              <SellerNavbar/>
              <SellerLoginPage />
              <Footer/>
          </>
        } />

         {/* Seller Navbar */}
         <Route path="/SellerNavbar" element={
          <>
              <SellerNavbar />
              </>
        } />

        {/* Seller kyc Page */}
        <Route path="/seller/kyc" element={
          <>
          <SellerNavbar />
              <SellerKycPage />
          </>
        } />

        {/* Seller Dashboard Page */}
        <Route path="/seller/dashboard" element={
  <>
    <SellerNavbar />
    <SellerDashboardPage />
  </>
} />

         {/* Serach */}
         <Route path="/Serach" element={
          <>
            <Navbar />
            <SearchPage />
          </>
        } />
         {/* Cart */}
         <Route path="/cart" element={
          <>
            <Navbar />
            <CartPage />
          </>
        } />

         {/* Help Center */}
         <Route path="/help" element={
          <>
            <Navbar />
            <HelpChat />
          </>
        } />

        {/* My Profile */}
        <Route path="/MyProfile" element={
          <>
            <Navbar />
            <MyProfile />
          </>
        } />
           {/* walletdashboard */}
           <Route path="/Wallet" element={
          <>
            <Navbar />
            <WalletDashboard />
          </>
        } />
        {/* Order Details */}
        <Route
  path="/order/:id"
  element={
    <>
      <Navbar />
      <OrderDetail />
    </>
  }
/>

{/* Page Layout */}
<Route
  path="/PageLayout"
  element={
    <>
      <Navbar />
      <PageLayout />
    </>
  }
/>

<Route
  path="/DownloadApp"
  element={
    <>
      <Navbar />
      <DownloadApp />
    </>
  }
/>
<Route
  path="/NotificationPreferences"
  element={
    <>
      <Navbar />
      <NotificationPreferences />
    </>
  }
/>
<Route
  path="/Advertise"
  element={
    <>
      <Navbar />
      <Advertise />
    </>
  }
/>
<Route
  path="/CustomerCare"
  element={
    <>
      <Navbar />
      <CustomerCare />
    </>
  }
/>
<Route
  path="/Terms"
  element={
    <>
      <Navbar />
      <Terms />
    </>
  }
/>
<Route
  path="/Language"
  element={
    <>
      <Navbar />
      <Language />
    </>
  }
/>
<Route
  path="/Privacy"
  element={
    <>
      <Navbar />
      <Privacy />
    </>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;