import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VerificationModal from '../components/VerificationModal';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authApi.login(formData);
            if (response.success) {
                toast.success('Login successful! Redirecting to dashboard...');
                navigate('/dashboard');
            } else {
                toast.error(response.message || 'Login failed');
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            const errorMessage = errorData?.message || error.message || 'Connection error. Please try again.';

            // Strictly trigger 2FA modal if AND ONLY IF the backend explicitly requires it
            if (errorData?.require2FA === true) {
                setLoginEmail(formData.email);
                setShow2FA(true);
                toast.success('Verification code sent to your email.');
                return;
            }

            // For all other errors (401, 500, etc.), show the specific error message from the backend
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-24 bg-gray-50">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                            <LogIn size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                        <p className="text-gray-500 mt-2">Access the Church Management Dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 transition-all"
                                    placeholder="admin@example.org"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">
                            ERC Kimisagara Parish Management System.
                            Unauthorized access is prohibited.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />

            <VerificationModal
                isOpen={show2FA}
                onClose={() => setShow2FA(false)}
                email={loginEmail}
                type="2fa"
                onSuccess={() => {
                    navigate('/dashboard');
                }}
            />
        </div>
    );
};

export default Login;
