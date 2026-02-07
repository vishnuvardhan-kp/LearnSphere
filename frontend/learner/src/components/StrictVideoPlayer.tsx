import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, CheckCircle, Lock, AlertCircle, Loader } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  onComplete: () => void;
  isCompleted: boolean;
}

export const StrictVideoPlayer: React.FC<VideoPlayerProps> = ({ url, onComplete, isCompleted: initialCompleted }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0); // 0 to 1
  const [duration, setDuration] = useState(0); // in seconds
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const playerRef = useRef<any>(null);
  const lastValidPlayed = useRef(0);
  const completionTriggered = useRef(false);

  // Reset state when URL changes (new lesson)
  useEffect(() => {
    lastValidPlayed.current = 0;
    completionTriggered.current = false;
    setPlayed(0);
    setIsPlaying(false);
    setIsLoading(true);
    setError(null);
  }, [url]);

  // Sync completion status from props without resetting playback
  useEffect(() => {
    if (initialCompleted) {
        setIsCompleted(true);
        completionTriggered.current = true;
    }
  }, [initialCompleted]);

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!isCompleted) {
        // Anti-cheat: prevent seeking forward
        // If current time is more than 2 seconds ahead of last valid time, force seek back
        if (state.playedSeconds - lastValidPlayed.current > 2) {
             playerRef.current?.seekTo(lastValidPlayed.current, 'seconds');
             return;
        }

        // Update last valid position if we are progressing normally (or staying same)
        if (state.playedSeconds > lastValidPlayed.current) {
            lastValidPlayed.current = state.playedSeconds;
        }

        if (state.played > played) {
            setPlayed(state.played);
        }
        
        // Check for completion (95% threshold)
        if (state.played >= 0.95 && !completionTriggered.current) {
            completionTriggered.current = true;
            setIsCompleted(true);
            onComplete();
        }
    } else {
        // When completed, allow free seeking and update tracking
        if (state.playedSeconds > lastValidPlayed.current) {
            lastValidPlayed.current = state.playedSeconds;
        }
        setPlayed(state.played);
    }
  };

  const handleDuration = (d: number) => {
    setDuration(d);
    setIsLoading(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCompleted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const seekSeconds = percentage * duration;
    
    setPlayed(percentage);
    lastValidPlayed.current = seekSeconds;
    playerRef.current?.seekTo(percentage, 'fraction');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if(!url) return <div className="bg-gray-900 text-white flex items-center justify-center h-full">No Video URL Provided</div>;

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group w-full">
        
        {/* Error State */}
        {error && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/90 text-white">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p>Failed to load video</p>
                <button onClick={() => setError(null)} className="mt-4 btn-secondary text-xs">Retry</button>
            </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-gray-900 text-white">
                <Loader size={32} className="animate-spin text-blue-500" />
            </div>
        )}

        {/* Player */}
        <div className="absolute inset-0 w-full h-full">
            <ReactPlayer
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                playing={isPlaying}
                controls={false}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onReady={() => setIsLoading(false)}
                onError={(e) => {
                    console.error("Video Error:", e);
                    setError("Video playback error");
                    setIsLoading(false);
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    if(!isCompleted && !completionTriggered.current) {
                         completionTriggered.current = true;
                         setIsCompleted(true);
                         onComplete();
                    }
                }}
                config={{
                    youtube: {
                        playerVars: { 
                            showinfo: 0, 
                            controls: 0, 
                            modestbranding: 1, 
                            rel: 0,
                            disablekb: 1,
                            fs: 0,
                            origin: window.location.origin
                        }
                    },
                    file: {
                        attributes: {
                            controlsList: 'nodownload',
                            disablePictureInPicture: true,
                            playsInline: true
                        }
                    }
                }}
            />
        </div>

        {/* Big Play Button Overlay */}
        {!isPlaying && !isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 backdrop-blur-[1px] transition-all">
                <button 
                    onClick={() => setIsPlaying(true)} 
                    className="bg-white/90 p-6 rounded-full text-blue-600 shadow-2xl transform transition-transform hover:scale-110 flex items-center justify-center group-hover:bg-white"
                >
                    <Play size={48} className="fill-current ml-2" />
                </button>
            </div>
        )}

        {/* Completed Badge */}
        {isCompleted && !isPlaying && (
             <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-xs font-bold shadow-lg pointer-events-none z-20 animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={14} /> Completed
             </div>
        )}

        {/* Custom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent px-4 py-3 flex flex-col gap-2 transition-opacity duration-300 z-20 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <div 
                className={`w-full h-1.5 bg-gray-600/50 rounded-full overflow-hidden ${isCompleted ? 'cursor-pointer hover:h-2' : 'cursor-not-allowed'}`}
                onClick={handleSeek}
            >
                <div 
                    className={`h-full relative transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${played * 100}%` }}
                ></div>
            </div>
            
            <div className="flex justify-between items-center text-white text-xs font-medium">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={togglePlay} 
                        className="hover:text-blue-400 transition-colors"
                    >
                        {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
                    </button>
                    <span>
                        {formatTime(played * duration)} / {formatTime(duration)}
                    </span>
                    {!isCompleted && (
                         <span className="text-gray-300 text-[10px] uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded bg-black/40">
                            Strict Mode
                         </span>
                    )}
                </div>
            </div>
        </div>
      </div>
      
      {/* Strict Mode Notice */}
      {!isCompleted && (
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-3">
             <Lock size={16} className="text-amber-600 mt-1 shrink-0" />
             <p className="text-sm text-amber-800">
                <strong>Strict Completion Mode:</strong> You must watch at least 95% of this video to mark the lesson as complete. Seeking is disabled.
             </p>
          </div>
      )}
      
      {/* Completion Notice */}
      {isCompleted && (
          <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-3">
             <CheckCircle size={16} className="text-green-600 shrink-0" />
             <p className="text-sm text-green-800">
                <strong>Lesson Completed!</strong> You can now replay freely.
             </p>
          </div>
      )}
    </div>
  );
};
