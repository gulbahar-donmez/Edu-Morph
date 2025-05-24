import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, learningStyleService, personalityService } from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Kullanıcı bilgileri alınamadı:', error);
                authService.logout();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold">Eğitim Platformu</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4">Hoş geldin, {user?.username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                        <h2 className="text-2xl font-bold mb-4">Öğrenme Stili Değerlendirmesi</h2>
                        <p className="mb-4">
                            Kişisel öğrenme stilinizi belirlemek için değerlendirmeyi tamamlayın.
                        </p>
                        <button
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => navigate('/learning-style')}
                        >
                            Değerlendirmeye Başla
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard; 