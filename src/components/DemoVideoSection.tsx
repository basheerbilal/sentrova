import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Download,
  Mic,
  Activity,
  Layers,
  ChevronRight,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { PackageTier } from '../types';

interface DemoVideoSectionProps {
  onOpenQuote?: (pkg?: PackageTier) => void;
}

interface DemoScenario {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  location: string;
  timecode: string;
  cameraName: string;
  resolution: string;
  latency: string;
  operatorName: string;
  operatorId: string;
  videoUrl: string;
  posterUrl: string;
  speechText: string;
  summary: string;
  savedValue: string;
  timeline: {
    time: number; // in seconds
    timeLabel: string;
    stage: string;
    action: string;
    severity: 'info' | 'warning' | 'critical' | 'success';
  }[];
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'voice-down',
    tabLabel: '1. Voice-Down Deterrence',
    badge: 'After-Hours Intrusion',
    title: 'Perimeter Breach & Instant Two-Way Voice Deterrence',
    location: 'Manchester Central Logistics Yard • Rear Compound',
    timecode: '02:41:18 UTC',
    cameraName: 'CAM-04 • NORTH WAREHOUSE EGRESS',
    resolution: '4K ULTRA HD • 60 FPS',
    latency: '18ms End-to-End',
    operatorName: 'James Vance',
    operatorId: 'OP-4092',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200&auto=format&fit=crop',
    speechText:
      'Warning: You are trespassing on private property under active live CCTV monitoring. Local police units have been notified. Vacate the compound immediately.',
    summary:
      'A masked trespasser approaches an equipment container with forced entry tools. Sentrova operator activates live high-output speaker broadcast within 12 seconds, causing the intruder to drop tools and flee.',
    savedValue: '£45,000 Equipment Saved',
    timeline: [
      {
        time: 0,
        timeLabel: '00:00',
        stage: 'Continuous Patrol',
        action: 'AI smart boundary tripped on compound perimeter fence. Controller alerted.',
        severity: 'info',
      },
      {
        time: 4,
        timeLabel: '00:04',
        stage: 'Human Verification',
        action: 'Operator J. Vance verifies suspicious masked individual carrying a crowbar.',
        severity: 'warning',
      },
      {
        time: 8,
        timeLabel: '00:08',
        stage: 'Voice Talkdown Initiated',
        action: 'Operator opens 120dB directional horn: "You are on live CCTV. Police dispatched."',
        severity: 'critical',
      },
      {
        time: 14,
        timeLabel: '00:14',
        stage: 'Intrusion Aborted',
        action: 'Subject abandons tool and runs toward perimeter wall. Incident dossier logged.',
        severity: 'success',
      },
    ],
  },
  {
    id: 'retail-theft',
    tabLabel: '2. Retail Shoplifting',
    badge: 'Concealment Interception',
    title: 'Active Merchandise Concealment & Floor Guard Coordination',
    location: 'London Luxury Retail & Fragrance Department Store',
    timecode: '16:15:42 UTC',
    cameraName: 'CAM-02 • HIGH-VALUE COSMETICS & PERFUME AISLE',
    resolution: '4K ULTRA HD • 30 FPS',
    latency: '22ms End-to-End',
    operatorName: 'Sarah Jenkins',
    operatorId: 'OP-5118',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?q=80&w=1200&auto=format&fit=crop',
    speechText:
      'Store Security Team: Priority alert on Aisle 4. Male in dark jacket has concealed three designer fragrance units into a foil-lined backpack. Approaching west exit.',
    summary:
      'Operator observes suspicious loitering and flags deliberate bag lining. Floor staff are alerted silently via radio headset before the suspect reaches the exit doors.',
    savedValue: '£1,420 Stock Recovered',
    timeline: [
      {
        time: 0,
        timeLabel: '00:00',
        stage: 'Dwell Time Trigger',
        action: 'Suspicious individual lingering around unlocked fragrance vitrine.',
        severity: 'info',
      },
      {
        time: 4,
        timeLabel: '00:04',
        stage: 'Concealment Confirmed',
        action: 'Three bottles slipped into booster bag. Operator tags timestamp and angle.',
        severity: 'warning',
      },
      {
        time: 8,
        timeLabel: '00:08',
        stage: 'Staff Radio Dispatch',
        action: 'Live audio message relayed directly to on-site floor manager radio.',
        severity: 'critical',
      },
      {
        time: 14,
        timeLabel: '00:14',
        stage: 'Interception at Egress',
        action: 'Customer approached politely before threshold. Stock returned intact.',
        severity: 'success',
      },
    ],
  },
  {
    id: 'pos-audit',
    tabLabel: '3. Till Sweethearting',
    badge: 'Cash Register Audit',
    title: 'POS Pass-Around Detection & Forensic Cash Drawer Audit',
    location: 'Birmingham 24/7 Supermarket & Express Fuel Station',
    timecode: '21:08:19 UTC',
    cameraName: 'CAM-01 • REGISTER 02 OVERHEAD TILL DOME',
    resolution: '1080P HD • 60 FPS',
    latency: '15ms End-to-End',
    operatorName: 'Marcus Cole',
    operatorId: 'OP-3024',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557b3bc?q=80&w=1200&auto=format&fit=crop',
    speechText:
      'Till discrepancy recorded: Register 2 pass-around on high-value carton without barcode scanning. Video timestamp indexed to electronic journal.',
    summary:
      'Staff member passes cigarettes and liquor across the counter to an acquaintance without ringing the till. Operator flags the exact timestamp for store owner audit.',
    savedValue: 'Internal Shrinkage Eliminated',
    timeline: [
      {
        time: 0,
        timeLabel: '00:00',
        stage: 'Transaction Initiated',
        action: 'Customer places multiple items on counter during evening shift.',
        severity: 'info',
      },
      {
        time: 4,
        timeLabel: '00:04',
        stage: 'Sweethearting Observed',
        action: 'Cashier deliberately passes carton beneath the laser optical scanner.',
        severity: 'warning',
      },
      {
        time: 8,
        timeLabel: '00:08',
        stage: 'E-Journal Cross-Match',
        action: 'Electronic receipt verification confirms zero-dollar item total for pass-through.',
        severity: 'critical',
      },
      {
        time: 14,
        timeLabel: '00:14',
        stage: 'Evidentiary Clip Export',
        action: 'Forensic dossier with time-stamped video exported to franchise director.',
        severity: 'success',
      },
    ],
  },
  {
    id: 'compound-breach',
    tabLabel: '4. Yard Compound Strobe',
    badge: 'Construction Security',
    title: 'Site Intrusion, Blue Strobe Trigger & Rapid Police Dispatch',
    location: 'Leeds Multi-Storey Commercial Development Site',
    timecode: '23:54:02 UTC',
    cameraName: 'CAM-08 • TOWER CRANE HEAVY PLANT ZONE',
    resolution: '4K ULTRA HD • 60 FPS',
    latency: '19ms End-to-End',
    operatorName: 'Alex Thompson',
    operatorId: 'OP-8821',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    speechText:
      'Emergency site announcement: Unauthorized personnel in high-risk plant zone. Sirens active. Keyholding patrol and emergency services are en route.',
    summary:
      'Two individuals climb perimeter barrier into an active excavator depot. Operator immediately fires high-intensity blue emergency strobes and initiates emergency keyholder dispatch.',
    savedValue: '£120,000 Copper & Plant Protected',
    timeline: [
      {
        time: 0,
        timeLabel: '00:00',
        stage: 'Perimeter Breach',
        action: 'Infrared tripwire activated along exterior security fencing.',
        severity: 'info',
      },
      {
        time: 4,
        timeLabel: '00:04',
        stage: 'Visual Confirmation',
        action: 'Night vision pan-tilt-zoom camera focuses on two hooded individuals.',
        severity: 'warning',
      },
      {
        time: 8,
        timeLabel: '00:08',
        stage: 'Strobes & Siren Fired',
        action: 'Remote relay triggers blue police strobes and 110dB warble alarm.',
        severity: 'critical',
      },
      {
        time: 14,
        timeLabel: '00:14',
        stage: 'Patrol Coordinated',
        action: 'Suspects scale back over fence. Patrol vehicle on-site in 3.8 minutes.',
        severity: 'success',
      },
    ],
  },
];

export const DemoVideoSection: React.FC<DemoVideoSectionProps> = ({ onOpenQuote }) => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePlaybackRate, setActivePlaybackRate] = useState<number>(1);
  const [simulatedTime, setSimulatedTime] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentScenario = DEMO_SCENARIOS[activeScenarioIndex];

  // Update live millisecond timecode
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const ms = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
      setSimulatedTime(
        `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(
          now.getUTCHours()
        )}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}.${ms} UTC`
      );
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Sync video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleSeekToTime = (timeInSeconds: number) => {
    setCurrentTime(timeInSeconds);
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleCycleSpeed = () => {
    const speeds = [1, 1.5, 2];
    const nextIndex = (speeds.indexOf(activePlaybackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setActivePlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Play realistic Voice-Down speech broadcast
  const handleTriggerVoiceDown = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentScenario.speechText);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.volume = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 4000);
    }
  };

  // Switch scenarios
  const handleSelectScenario = (index: number) => {
    setActiveScenarioIndex(index);
    setCurrentTime(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Determine current active milestone in timeline
  const activeTimelineItem =
    [...currentScenario.timeline]
      .reverse()
      .find((item) => currentTime >= item.time) || currentScenario.timeline[0];

  return (
    <section
      id="demo-video"
      className="py-20 lg:py-28 bg-[#060E1E] text-white relative overflow-hidden selection:bg-[#00D2FF] selection:text-[#060E1E] border-t border-sky-500/10"
    >
      {/* Tactical Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D2FF 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] text-xs font-bold tracking-widest uppercase mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>OPERATIONAL DEMO & TELEMETRY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            See Sentrova in Action:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-300 to-[#00D2FF]">
              Active Voice-Down
            </span>{' '}
            in Under 30s
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Watch how certified UK controllers spot concealed theft, activate live directional audio talkdowns, and protect commercial property in real time.
          </p>
        </div>

        {/* Scenario Tabs Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {DEMO_SCENARIOS.map((scenario, index) => {
            const isActive = index === activeScenarioIndex;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(index)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                  isActive
                    ? 'bg-[#087BFF] border-[#38BDF8] text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{scenario.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Video & Timeline Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Video Player & Tactical HUD (7 or 8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* The Video Container with HUD */}
            <div
              ref={containerRef}
              className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl shadow-blue-950/40 group select-none"
            >
              {/* Actual HTML5 Video Element */}
              <video
                ref={videoRef}
                src={currentScenario.videoUrl}
                poster={currentScenario.posterUrl}
                playsInline
                loop
                muted={isMuted}
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onClick={handleTogglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Scanline CRT overlay for surveillance authenticity */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.08]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
                  backgroundSize: '100% 4px',
                }}
              />

              {/* Subtle Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

              {/* TOP HUD: Live Camera Telemetry */}
              <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 flex items-start justify-between pointer-events-none z-20 text-[10px] sm:text-xs font-mono">
                {/* Left Top: Camera identity & live REC */}
                <div className="space-y-1 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15">
                  <div className="flex items-center gap-2 font-bold text-white tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block" />
                    <span>REC • {currentScenario.cameraName}</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {simulatedTime || currentScenario.timecode}
                  </div>
                </div>

                {/* Right Top: Network & Controller Status */}
                <div className="text-right space-y-1 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15">
                  <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>OPERATOR: {currentScenario.operatorName} ({currentScenario.operatorId})</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {currentScenario.resolution} • Latency: {currentScenario.latency}
                  </div>
                </div>
              </div>

              {/* CENTER HUD: Dynamic Target Acquisition Box (Simulated AI Cueing) */}
              <div
                className="absolute top-[28%] left-[34%] w-[32%] h-[42%] border-2 border-emerald-400/80 rounded-sm pointer-events-none transition-all duration-700 z-10"
                style={{
                  borderColor:
                    activeTimelineItem.severity === 'critical'
                      ? '#EF4444'
                      : activeTimelineItem.severity === 'warning'
                      ? '#F59E0B'
                      : '#10B981',
                }}
              >
                {/* Crosshairs & Corner marks */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

                <div className="absolute -top-6 left-0 bg-black/80 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-white border border-white/20 whitespace-nowrap flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeTimelineItem.severity === 'critical'
                        ? 'bg-red-500 animate-ping'
                        : activeTimelineItem.severity === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span>TARGET ID #92: {activeTimelineItem.stage}</span>
                </div>
              </div>

              {/* Voice-Down Live Broadcast Waveform Overlay when active */}
              {isSpeaking && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/85 backdrop-blur-md p-5 rounded-2xl border border-red-500/50 shadow-2xl flex flex-col items-center gap-2.5 max-w-sm text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 animate-pulse">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div className="text-red-400 font-extrabold text-xs tracking-widest uppercase">
                    LIVE 2-WAY TALKDOWN BROADCASTING
                  </div>
                  <p className="text-white text-xs sm:text-sm font-mono leading-snug">
                    "{currentScenario.speechText}"
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[16, 28, 44, 20, 36, 18, 48, 30, 16, 38, 22].map((height, i) => (
                      <span
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Big Centered Play/Pause Button when hovered or paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#087BFF]/90 hover:bg-[#087BFF] text-white flex items-center justify-center shadow-xl shadow-blue-500/40 cursor-pointer z-30 transition-transform hover:scale-105"
                  aria-label="Play surveillance demo"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              )}

              {/* BOTTOM HUD: Custom Scrubber & Tactical Player Controls */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 space-y-2.5">
                {/* Interactive Scrubber with Milestone Markers */}
                <div className="relative w-full group/slider">
                  <input
                    type="range"
                    min="0"
                    max={duration || 15}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#087BFF] focus:outline-hidden"
                  />
                  {/* Timeline Event Pins on Slider */}
                  <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 pointer-events-none flex justify-between px-1">
                    {currentScenario.timeline.map((step, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSeekToTime(step.time);
                        }}
                        title={`${step.timeLabel} - ${step.stage}`}
                        className="w-2.5 h-2.5 rounded-full border border-black pointer-events-auto cursor-pointer -mt-0.5 hover:scale-150 transition-transform"
                        style={{
                          backgroundColor:
                            step.severity === 'critical'
                              ? '#EF4444'
                              : step.severity === 'warning'
                              ? '#F59E0B'
                              : '#10B981',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Toolbar Buttons */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSeekToTime(0)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      title="Replay from start"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors flex items-center gap-1.5"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#38BDF8]" />}
                      <span className="text-[10px] hidden sm:inline text-slate-400">
                        {isMuted ? 'Muted' : 'Audio On'}
                      </span>
                    </button>

                    {/* Elapsed Time Display */}
                    <span className="font-mono text-[11px] text-slate-300">
                      00:{Math.floor(currentTime).toString().padStart(2, '0')} / 00:
                      {Math.floor(duration).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Live Speech Synthesis Trigger Button */}
                    <button
                      type="button"
                      onClick={handleTriggerVoiceDown}
                      disabled={isSpeaking}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <Mic className="w-3.5 h-3.5 text-red-400" />
                      <span>{isSpeaking ? 'Broadcasting...' : 'Test Live Voice-Down'}</span>
                    </button>

                    {/* Speed Selector */}
                    <button
                      type="button"
                      onClick={handleCycleSpeed}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-slate-300 cursor-pointer"
                      title="Change playback speed"
                    >
                      {activePlaybackRate}x
                    </button>

                    {/* Fullscreen Button */}
                    <button
                      type="button"
                      onClick={handleToggleFullscreen}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Strip Below Video */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[#38BDF8] font-bold text-[10px] uppercase">
                    {currentScenario.badge}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">{currentScenario.location}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white">{currentScenario.title}</h3>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Financial Impact
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {currentScenario.savedValue}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Incident Chronology & Controller Action Steps (4 or 5 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4 text-left">
            {/* Incident Chronology Card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#087BFF]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Incident Chronology
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  VERIFIED HUMAN OPERATOR
                </span>
              </div>

              {/* Step by Step Timeline */}
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {currentScenario.timeline.map((item, idx) => {
                  const isCurrent = activeTimelineItem.time === item.time;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSeekToTime(item.time)}
                      className={`relative pl-8 pr-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-500/10 border-blue-500/40 text-white shadow-md'
                          : 'bg-white/2 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      {/* Timeline dot */}
                      <span
                        className={`absolute left-2 top-3.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                          item.severity === 'critical'
                            ? 'bg-red-500'
                            : item.severity === 'warning'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        } ${isCurrent ? 'ring-2 ring-blue-400 scale-125' : ''}`}
                      />

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-300">
                          {item.timeLabel}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            item.severity === 'critical'
                              ? 'bg-red-950 text-red-400'
                              : item.severity === 'warning'
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {item.stage}
                        </span>
                      </div>

                      <p className="text-xs mt-1 leading-relaxed">{item.action}</p>
                    </div>
                  );
                })}
              </div>

              {/* Voice Deterrence Direct Audio Quote */}
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#38BDF8] font-bold">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Authorized Speaker Talkdown Script</span>
                </div>
                <p className="text-slate-300 text-xs italic leading-snug">
                  "{currentScenario.speechText}"
                </p>
                <button
                  type="button"
                  onClick={handleTriggerVoiceDown}
                  className="w-full mt-1 py-2 rounded-lg bg-[#087BFF] hover:bg-[#0756C9] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play Broadcast Audio</span>
                </button>
              </div>

              {/* Conversion Actions */}
              <div className="pt-2 space-y-2.5">
                <a
                  href="https://api.whatsapp.com/send/?phone=447448871603&text=Hello%20Sentrova,%20I%20would%20like%20to%20inquire%20about%20booking%20monitoring%20($1.99/hr)%20via%20WhatsApp."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquire via WhatsApp ($1.99/hr)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => onOpenQuote?.()}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-white/15 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                  <span>Schedule Live 1-on-1 Camera Pilot</span>
                </button>
              </div>
            </div>

            {/* 4 Guarantees Quick Pill */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-base font-extrabold text-[#38BDF8]">&lt; 30s</div>
                <div className="text-[10px] text-slate-400 font-medium">Alert to Speaker</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-base font-extrabold text-emerald-400">98.4%</div>
                <div className="text-[10px] text-slate-400 font-medium">Intruder Abort Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
