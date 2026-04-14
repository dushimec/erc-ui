import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { authApi } from '../api/auth';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    type: 'email' | '2fa';
    onSuccess: () => void;
    onResend?: () => Promise<void>;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
    isOpen,
    onClose,
    email,
    type,
    onSuccess,
    onResend
}) => {
    const length = 6;
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        if (!isOpen) return;
        // Reset code when modal opens with correct length
        setCode(Array(length).fill(''));

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, length]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Auto focus next input
        if (value && index < length - 1) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length !== length) {
            toast.error(`Please enter the complete ${length}-digit code`);
            return;
        }

        try {
            setIsSubmitting(true);
            const response = type === 'email'
                ? await authApi.verifyEmail({ email, code: fullCode })
                : await authApi.verify2FA({ email, code: fullCode });

            if (response.success) {
                toast.success(type === 'email' ? 'Registered successfully!' : '2FA verified successfully!');
                onSuccess();
                onClose();
            } else {
                toast.error(response.message || 'Verification failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid verification code');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Security Verification" size="md">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110">
                    <ShieldCheck className="text-red-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Verify Your Identity</h2>
                <p className="text-gray-500 text-center mt-2 px-4">
                    We've sent a {length}-digit verification code to <br />
                    <span className="font-semibold text-gray-900">{email}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center gap-2 md:gap-3">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInput(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-14 md:w-11 md:h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                            required
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        Code expires in: <span className="text-red-600 font-bold tabular-nums">{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <RefreshCw className="animate-spin" size={20} />
                        ) : (
                            <>
                                Verify Code
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                        onClick={async () => {
                            if (onResend) {
                                await onResend();
                            } else {
                                toast.info('Requesting a new code...');
                            }
                            setTimeLeft(600); // Reset timer
                        }}
                    >
                        Didn't receive the code? Resend
                    </button>

                    <div className="pt-4 border-t border-gray-100 w-full text-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default VerificationModal;
