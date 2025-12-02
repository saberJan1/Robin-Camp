import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, DollarSign, Star, Zap } from 'lucide-react';
import { getMovieById } from '../api/movies';
import { Movie, RatingAggregate } from '../types';
import { Navbar } from '../components/Navbar';
import { getRating } from '../api/ratings';

export const MoviePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [rating, setRating] = useState<RatingAggregate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchMovie = async () => {
                try {
                    setLoading(true);
                    const movieData = await getMovieById(id);
                    setMovie(movieData);
                    const ratingData = await getRating(movieData.title);
                    setRating(ratingData);
                } catch (error) {
                    console.error('Failed to fetch movie details', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMovie();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-sci-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-white">
                 <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-sci-primary hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Database
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <Navbar />

            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-sci-muted hover:text-sci-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Database
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-8">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-white mb-2 neon-text leading-tight">
                                        {movie.title}
                                    </h1>
                                    <p className="text-lg text-sci-muted">{movie.genre}</p>
                                </div>
                                <div className="flex items-center space-x-2 text-yellow-400">
                                    <Star className="w-6 h-6 fill-current" />
                                    <span className="text-2xl font-bold">{rating ? rating.average.toFixed(1) : '-'}</span>
                                    <span className="text-sm text-sci-muted mt-1">({rating ? rating.count : 0} ratings)</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-sci-base/20 px-8 py-6 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-sci-muted">Release Date</p>
                                <p className="flex items-center text-white font-medium">
                                    <Calendar className="w-4 h-4 mr-2 text-sci-secondary" />
                                    {new Date(movie.releaseDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-sci-muted">MPA Rating</p>
                                <p className="text-white font-medium">{movie.mpaRating || 'Not Rated'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-sci-muted">Budget</p>
                                <p className="flex items-center text-white font-medium">
                                    <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                                    {movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-sci-muted">Distributor</p>
                                <p className="text-white font-medium">{movie.distributor || 'N/A'}</p>
                            </div>
                        </div>
                        
                        {movie.boxOffice && (
                            <div className="px-8 py-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                    <Zap className="w-5 h-5 mr-2 text-sci-primary" />
                                    Box Office Performance
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-sci-muted">Opening Weekend</p>
                                        <p className="text-xl font-mono text-white">${(movie.boxOffice.revenue.openingWeekend / 1000000).toFixed(2)}M</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-sci-muted">Domestic</p>
                                        <p className="text-xl font-mono text-white">${(movie.boxOffice.revenue.usa / 1000000).toFixed(2)}M</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-sci-muted">Worldwide</p>
                                        <p className="text-xl font-mono text-white">${(movie.boxOffice.revenue.worldwide / 1000000).toFixed(2)}M</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
