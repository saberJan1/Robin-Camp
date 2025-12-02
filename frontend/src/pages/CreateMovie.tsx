import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import { createMovie } from '../api/movies';
import { Navbar } from '../components/Navbar';

export const CreateMovie: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        releaseDate: '',
        distributor: '',
        budget: '',
        mpaRating: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMovie({
                ...formData,
                budget: formData.budget ? parseInt(formData.budget) : undefined,
                distributor: formData.distributor || undefined,
                mpaRating: formData.mpaRating || undefined,
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to create movie', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <Navbar />

            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-sci-muted hover:text-sci-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Database
                </button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel rounded-2xl p-8 border border-white/10"
                >
                    <h1 className="text-3xl font-bold text-white mb-8 neon-text">
                        New Entry
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-sci-muted mb-1">Title *</label>
                                <input
                                    required
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-sci-base/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sci-primary focus:ring-1 focus:ring-sci-primary outline-none transition-all"
                                    placeholder="Enter movie title"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-sci-muted mb-1">Genre *</label>
                                    <input
                                        required
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        className="w-full bg-sci-base/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sci-primary focus:ring-1 focus:ring-sci-primary outline-none transition-all"
                                        placeholder="e.g. Sci-Fi"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-sci-muted mb-1">Release Date *</label>
                                    <input
                                        required
                                        type="date"
                                        name="releaseDate"
                                        value={formData.releaseDate}
                                        onChange={handleChange}
                                        className="w-full bg-sci-base/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sci-primary focus:ring-1 focus:ring-sci-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-sci-muted mb-1">Distributor</label>
                                    <input
                                        name="distributor"
                                        value={formData.distributor}
                                        onChange={handleChange}
                                        className="w-full bg-sci-base/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sci-primary focus:ring-1 focus:ring-sci-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-sci-muted mb-1">Budget (USD)</label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full bg-sci-base/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sci-primary focus:ring-1 focus:ring-sci-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sci-muted mb-1">MPA Rating</label>
                                <select
                                    name="mpaRating"
                                    value={formData.mpaRating}
                                    onChange={handleChange}
                                    className="w-full bg-sci-base/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sci-primary focus:ring-1 focus:ring-sci-primary outline-none transition-all"
                                >
                                    <option value="">Select Rating</option>
                                    <option value="G">G</option>
                                    <option value="PG">PG</option>
                                    <option value="PG-13">PG-13</option>
                                    <option value="R">R</option>
                                    <option value="NC-17">NC-17</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center space-x-2 bg-sci-primary hover:bg-sci-primary/90 text-white py-3 rounded-lg font-bold tracking-wide transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>INITIATE UPLOAD</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
