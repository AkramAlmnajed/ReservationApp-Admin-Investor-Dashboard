import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './ButtonPages/AdminPages/HomePage';
import BrowseRequestPage from './ButtonPages/AdminPages/BrowseRequestPage';
import InvestorsAccountsPage from './ButtonPages/AdminPages/InvestorsAccountsPage';
import BrowseAdsPage from './ButtonPages/AdminPages/BrowseAdsPage';
import UsersFeedbackPage from './ButtonPages/AdminPages/UsersFeedbackPage';
import LoginForm from './LoginForm/LoginPage';
import InvestorHomePage from './ButtonPages/InvestorsPages/InvestorHomePage';
import BrowseMyAds from './ButtonPages/InvestorsPages/BrowseMyAds';
import MyFeedBacks from './ButtonPages/InvestorsPages/MyFeedBacks';
import MyPlaces from './ButtonPages/InvestorsPages/MyPlaces';
import MyAccount from './ButtonPages/InvestorsPages/MyAccount'; 
import UsersAccountsPage from './ButtonPages/AdminPages/UsersAccountsPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/browse-request" element={<PrivateRoute element={<BrowseRequestPage />} />} />
        <Route path="/investors-accounts" element={<PrivateRoute element={<InvestorsAccountsPage />} />} />
        <Route path="/users-accounts" element={<PrivateRoute element={<UsersAccountsPage />} />} /> 
        <Route path="/browse-ads" element={<PrivateRoute element={<BrowseAdsPage />} />} />
        <Route path="/users-feedback" element={<PrivateRoute element={<UsersFeedbackPage />} />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/new-page" /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/new-page" element={<PrivateRoute element={<InvestorHomePage />} />} />
        <Route path="/investor/browse-my-ads" element={<PrivateRoute element={<BrowseMyAds />} />} />
        <Route path="/investor/my-feedbacks" element={<PrivateRoute element={<MyFeedBacks />} />} />
        <Route path="/investor/my-places" element={<PrivateRoute element={<MyPlaces />} />} />
        <Route path="/investor/my-account" element={<PrivateRoute element={<MyAccount />} />} /> 
      </Routes>
    </Router>
  );
}

export default App;
