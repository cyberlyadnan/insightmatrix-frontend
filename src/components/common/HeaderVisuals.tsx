"use client";

import { Sparkles } from "lucide-react";

interface FloatingTagsProps {
    imageSrc: string;
    tags: { text: string; color: string }[];
    badgeText: string;
}

export function FloatingTagsVisual({ imageSrc, tags, badgeText }: FloatingTagsProps) {
    return (
        <div className="relative flex justify-center items-center">
            {/* Central Content */}
            <div className="relative z-10 p-2 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent1 shadow-2xl">
                <img
                    src={imageSrc}
                    alt="Visual"
                    className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-white object-cover shadow-lg"
                />
            </div>

            {/* Floating Tags */}
            <div className="absolute inset-0 pointer-events-none">
                {tags.map((tag, i) => {
                    const angles = [0, 45, 135, 180, 225, 315];
                    const angle = angles[i % angles.length] || (i * 60);
                    const radius = 160;
                    const radian = (angle * Math.PI) / 180;
                    const x = Math.cos(radian) * radius;
                    const y = Math.sin(radian) * radius;

                    return (
                        <div
                            key={i}
                            className={`absolute hidden md:flex items-center px-4 py-2 rounded-full text-xs font-black shadow-lg border border-white/50 animate-float ${tag.color} text-white transition-transform hover:scale-110`}
                            style={{
                                transform: `translate(${x}px, ${y}px)`,
                                animationDelay: `${i * 0.5}s`,
                                top: '50%',
                                left: '50%',
                                marginTop: '-16px',
                                marginLeft: '-40px'
                            }}
                        >
                            {tag.text}
                        </div>
                    );
                })}
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl -z-0" />

            {/* Bottom Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white px-8 py-4 rounded-full shadow-2xl z-20 flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent1 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold tracking-wide uppercase">{badgeText}</span>
            </div>
        </div>
    );
}

export function GridVisual() {
    return (
        <div className="relative p-8 w-full max-w-md mx-auto aspect-square flex items-center justify-center">
             <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3">
                {[...Array(9)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`rounded-2xl shadow-sm border border-gray-100 ${
                            i % 2 === 0 ? "bg-white" : "bg-brand-subtle"
                        } animate-pulse`} 
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
             </div>
             <div className="relative z-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary mx-auto mb-4 flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-xl font-black text-gray-900 leading-tight">Agile Solutions</p>
                <div className="mt-4 flex flex-col gap-2">
                    <div className="h-1.5 w-16 bg-brand-light rounded-full mx-auto" />
                    <div className="h-1.5 w-10 bg-brand-subtle rounded-full mx-auto" />
                </div>
             </div>
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white px-8 py-4 rounded-full shadow-2xl z-20 flex items-center gap-3 whitespace-nowrap">
                <span className="text-sm font-bold tracking-wide uppercase">Insight Data</span>
            </div>
        </div>
    );
}

export function StackedVisual({ image1, image2, image3 }: { image1: string; image2: string; image3: string }) {
    return (
        <div className="relative h-80 w-full flex items-center justify-center">
            <img 
                src={image1} 
                className="absolute w-40 h-56 object-cover rounded-3xl shadow-xl -rotate-12 translate-x-[-60px] border-4 border-white" 
                alt="Stacked 1" 
            />
             <img 
                src={image3} 
                className="absolute w-40 h-56 object-cover rounded-3xl shadow-xl rotate-12 translate-x-[60px] border-4 border-white" 
                alt="Stacked 3" 
            />
            <img 
                src={image2} 
                className="absolute w-48 h-64 object-cover rounded-[2rem] shadow-2xl z-10 border-4 border-white" 
                alt="Stacked 2" 
            />
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white px-8 py-4 rounded-full shadow-2xl z-20 flex items-center gap-3 whitespace-nowrap">
                <span className="text-sm font-bold tracking-wide uppercase">Real People</span>
            </div>
        </div>
    );
}
