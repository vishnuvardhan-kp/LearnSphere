import { ArrowLeft, GraduationCap, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export const WatchStory = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Autoplay video when component mounts
    useEffect(() => {
        if (videoRef.current) {
            // Attempt to autoplay
            videoRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((error) => {
                    // Autoplay was prevented, user needs to interact
                    console.log('Autoplay prevented:', error);
                    setIsPlaying(false);
                });
        }
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
            {/* Header with Back Button */}
            <header className="p-6 lg:p-8 relative z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
                        <span className="text-white font-bold text-sm uppercase tracking-widest">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-black text-xl tracking-tight">
                            Learn<span className="text-brand-blue">Sphere</span>
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="max-w-6xl w-full">
                    {/* Title Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                            The LearnSphere Mission
                        </h1>
                        <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">
                            Redefining digital education through immersion, gamified rewards, and powerful content mastery.
                        </p>
                    </div>

                    {/* Video Player */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand-blue/20 border border-white/10 bg-black group">
                        {/* Video Element */}
                        <video
                            ref={videoRef}
                            className="w-full aspect-video object-cover"
                            autoPlay
                            playsInline
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={() => setIsPlaying(false)}
                            onClick={togglePlay}
                        >
                            <source src="/LearnSphere_Mission_Preview.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Play Overlay (when paused) */}
                        {!isPlaying && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer transition-opacity"
                                onClick={togglePlay}
                            >
                                <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center shadow-2xl shadow-brand-blue/50 hover:scale-110 transition-transform">
                                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                                </div>
                            </div>
                        )}

                        {/* Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Progress Bar */}
                            <div className="mb-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-blue [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-white/60 font-bold mt-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={togglePlay}
                                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-5 h-5 text-white" />
                                        ) : (
                                            <Play className="w-5 h-5 text-white fill-white" />
                                        )}
                                    </button>

                                    <button
                                        onClick={toggleMute}
                                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
                                    >
                                        {isMuted ? (
                                            <VolumeX className="w-5 h-5 text-white" />
                                        ) : (
                                            <Volume2 className="w-5 h-5 text-white" />
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={toggleFullscreen}
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
                                >
                                    <Maximize className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CTA Below Video */}
                    <div className="mt-12 text-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-brand-blue/30"
                        >
                            Get Started Today
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center">
                <p className="text-gray-500 text-sm font-medium">
                    © 2026 LearnSphere. Knowledge for All, Mastery for the Driven.
                </p>
            </footer>
        </div>
    );
};
