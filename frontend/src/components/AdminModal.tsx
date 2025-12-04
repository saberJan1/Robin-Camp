import { useState, type FC, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Key } from 'lucide-react';
import { createMovie } from '../api/movies';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AdminModal: FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('AUTH_TOKEN') || '');
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        releaseDate: '',
        distributor: '',
        budget: '',
        mpaRating: ''
    });

    const handleTokenSave = () => {
        localStorage.setItem('AUTH_TOKEN', token);
        alert('Token saved!');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMovie({
                ...formData,
                budget: formData.budget ? parseInt(formData.budget) : undefined,
                distributor: formData.distributor || undefined,
                mpaRating: formData.mpaRating || undefined,
            });
            onSuccess();
            onClose();
            setFormData({
                title: '',
                genre: '',
                releaseDate: '',
                distributor: '',
                budget: '',
                mpaRating: ''
            });
        } catch (error) {
            console.error('Failed to create movie', error);
            alert('Failed to create movie. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh] border border-gray-700">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900/50">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <Key className="w-5 h-5 mr-3 text-sci-primary" />
                                    Admin Console
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 space-y-8">
                                {/* Token Section */}
                                <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Authentication Token
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            placeholder="Enter API Token"
                                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-sci-primary focus:ring-2 focus:ring-sci-primary/20 outline-none transition-all placeholder-gray-500"
                                        />
                                        <button
                                            onClick={handleTokenSave}
                                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 shadow-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* Form Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Add New Movie</h3>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Title *</label>
                                            <input
                                                required
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-sci-primary focus:ring-2 focus:ring-sci-primary/20 outline-none transition-all placeholder-gray-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Genre *</label>
                                                <input
                                                    required
                                                    name="genre"
                                                    value={formData.genre}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-sci-primary focus:ring-2 focus:ring-sci-primary/20 outline-none transition-all placeholder-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Release Date *</label>
                                                <input
                                                    required
                                                    type="date"
                                                    name="releaseDate"
                                                    value={formData.releaseDate}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-sci-primary focus:ring-2 focus:ring-sci-primary/20 outline-none transition-all [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Distributor</label>
                                                <input
                                                    name="distributor"
                                                    value={formData.distributor}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-sci-primary focus:ring-2 focus:ring-sci-primary/20 outline-none transition-all placeholder-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Budget (USD)</label>
                                                <input
                                                    type="number"
                                                    name="budget"
                                                    value={formData.budget}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-sci-primary focus:ring-2 focus:ring-sci-primary/20 outline-none transition-all placeholder-gray-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5">MPA Rating</label>
                                            <select
                                                name="mpaRating"
                                                value={formData.mpaRating}
                                                onChange={handleChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-sci-primary focus:ring-2 focus:ring-sci-primary/20 outline-none transition-all"
                                            >
                                                <option value="">Select Rating</option>
                                                <option value="G">G</option>
                                                <option value="PG">PG</option>
                                                <option value="PG-13">PG-13</option>
                                                <option value="R">R</option>
                                                <option value="NC-17">NC-17</option>
                                            </select>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex items-center justify-center space-x-2 bg-sci-primary hover:bg-sky-600 text-white py-3 rounded-lg font-bold tracking-wide transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        <span>Create Movie</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
