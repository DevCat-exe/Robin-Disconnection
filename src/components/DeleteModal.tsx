import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    loading?: boolean;
}

export function DeleteModal({ isOpen, onClose, onConfirm, title, message, loading = false }: DeleteModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="horror-modal-overlay" onClick={onClose}>
                    <motion.div
                        className="horror-modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Static noise background */}
                        <div
                            className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
                            style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                            }}
                        />

                        {/* Warning Icon */}
                        <motion.div
                            className="text-center mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        >
                            <div className="inline-block pulse-warning">
                                <div className="text-6xl text-red-600">⚠️</div>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="text-2xl font-bold text-red-500 text-center mb-4 tracking-widest glitch-text"
                            style={{ fontFamily: 'VT323, monospace' }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            {title}
                        </motion.h2>

                        {/* Message */}
                        {message && (
                            <motion.p
                                className="text-gray-400 text-center mb-8 leading-relaxed"
                                style={{ fontFamily: 'VT323, monospace', fontSize: '1.1rem' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {message}
                            </motion.p>
                        )}

                        {/* Buttons */}
                        <motion.div
                            className="flex gap-6 justify-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="btn-horror-ghost px-8 py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: 'VT323, monospace', fontSize: '1rem' }}
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="btn-horror-danger px-8 py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: 'VT323, monospace', fontSize: '1rem' }}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="typing-indicator">
                                            <span className="typing-dot"></span>
                                            <span className="typing-dot"></span>
                                            <span className="typing-dot"></span>
                                        </div>
                                        DELETING...
                                    </span>
                                ) : (
                                    'DELETE'
                                )}
                            </button>
                        </motion.div>

                        {/* Corner accents */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-red-900/50 -mt-2 -mr-2" />
                        <div className="absolute bottom-0 left-0 w-0 h-0 border-b-8 border-l-8 border-red-900/50 -mb-2 -ml-2" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
