import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';

export const Hero = () => {
    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop")'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-sci-primary bg-sci-primary/10 rounded-full uppercase border border-sci-primary/20 backdrop-blur-md">
                        Now Streaming
                    </span>
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter text-shadow-lg">
                        The Cinematic <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sci-primary to-purple-500">Experience</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg font-light">
                        Immerse yourself in a curated collection of masterpieces. Where storytelling meets visual perfection.
                    </p>

                    <div className="flex items-center space-x-5">
                        <button className="flex items-center px-8 py-4 bg-sci-primary hover:bg-sky-600 text-white rounded-full font-bold transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-1">
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            Start Exploring
                        </button>
                        <button className="flex items-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold transition-all border border-white/10 backdrop-blur-sm hover:border-white/30">
                            <Info className="w-5 h-5 mr-2" />
                            Learn More
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
