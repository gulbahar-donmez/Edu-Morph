import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PersonalityTest from './pages/PersonalityTest';
import LearningStyleTest from './pages/LearningStyleTest';
import LearningStyleRecommendations from './pages/LearningStyleRecommendations';
import Lessons from './pages/Lessons';
import Welcome from './pages/Welcome';
import Results from './pages/Results';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Özel rota bileşeni - oturum kontrolü için
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <ScrollToTop />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/personality-test" element={
                            <PrivateRoute>
                                <PersonalityTest />
                            </PrivateRoute>
                        } />
                        <Route path="/learning-style-test" element={
                            <PrivateRoute>
                                <LearningStyleTest />
                            </PrivateRoute>
                        } />
                        <Route path="/learning-style-recommendations" element={<LearningStyleRecommendations />} />
                        <Route path="/lessons" element={
                            <PrivateRoute>
                                <Lessons />
                            </PrivateRoute>
                        } />
                        <Route path="/results" element={
                            <PrivateRoute>
                                <Results />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
