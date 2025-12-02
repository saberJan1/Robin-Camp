import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, DollarSign } from 'lucide-react';
import { Movie, RatingAggregate } from '../types';
import { getRating } from '../api/ratings';

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const [rating, setRating] = React.useState<RatingAggregate | null>(null);

    React.useEffect(() => {
        getRating(movie.title).then(setRating).catch(() => setRating(null));
    }, [movie.title]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group perspective-1000"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-sci-primary/20 to-sci-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative h-full glass-panel rounded-xl p-6 overflow-hidden border border-white/5 hover:border-sci-primary/30 transition-colors duration-300 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-sci-primary transition-colors line-clamp-2">
                            {movie.title}
                        </h3>
                        <span className="px-2 py-1 rounded text-xs font-mono bg-sci-surface border border-white/10 text-sci-muted">
                            {movie.mpaRating || 'NR'}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm text-sci-muted mb-6">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-sci-secondary" />
                            <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-sci-accent">G</span>
                            <span>{movie.genre}</span>
                        </div>
                        {movie.boxOffice && (
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span>{(movie.boxOffice.revenue.worldwide / 1000000).toFixed(1)}M</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-mono font-bold">{rating ? rating.average.toFixed(1) : '-'}</span>
                        <span className="text-xs text-sci-muted ml-1">({rating ? rating.count : 0})</span>
                    </div>

                    <button className="text-xs uppercase tracking-wider text-sci-primary hover:text-white transition-colors">
                        Details &rarr;
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
