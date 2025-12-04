import { useState, useEffect, type FC } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Film, Play } from 'lucide-react';
import type { Movie, RatingAggregate } from '../types';
import { getRating } from '../api/ratings';

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard: FC<MovieCardProps> = ({ movie }) => {
    const [rating, setRating] = useState<RatingAggregate | null>(null);

    useEffect(() => {
        getRating(movie.title).then(setRating).catch(() => setRating(null));
    }, [movie.title]);

    const formatMoney = (amount: number) => {
        if (amount >= 1000000000) {
            return `$ ${(amount / 1000000000).toFixed(1)}B`;
        }
        return `$ ${(amount / 1000000).toFixed(1)}M`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-sci-primary/10 transition-all duration-300 border border-gray-700/50"
        >
            {/* Box Office Badge */}
            {movie.boxOffice && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-md border border-white/10">
                    {formatMoney(movie.boxOffice.revenue.worldwide)}
                </div>
            )}

            {/* Placeholder Image Gradient */}
            <div className="h-[300px] bg-gradient-to-b from-gray-700 to-gray-900 relative overflow-hidden group-hover:brightness-110 transition-all">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="w-16 h-16 text-gray-600 opacity-30" />
                </div>

                {/* Hover Overlay with Watch Button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button className="flex items-center px-6 py-3 bg-sci-primary text-white rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-sci-primary/30">
                        <Play className="w-4 h-4 mr-2 fill-current" />
                        Watch
                    </button>
                </div>

                {/* Title Overlay (Always visible but moves up on hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pt-16">
                    <h3 className="text-xl font-bold text-white leading-tight mb-1 drop-shadow-md">
                        {movie.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-300 space-x-3">
                        <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-sci-primary" />
                            {new Date(movie.releaseDate).getFullYear()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span className="truncate max-w-[100px]">
                            {movie.distributor || 'Unknown'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 bg-gray-800 border-t border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="font-bold text-white">{rating ? rating.average.toFixed(1) : '-'}</span>
                    <span className="text-xs text-gray-500">({rating ? rating.count : 0})</span>
                </div>

                <span className="text-xs font-medium text-gray-400 px-2 py-0.5 rounded border border-gray-600/50 bg-gray-700/30">
                    {movie.mpaRating || 'NR'}
                </span>
            </div>
        </motion.div>
    );
};
