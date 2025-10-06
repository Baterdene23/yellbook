"use client"
export default function Loading() {
    return (
        <div className="min-h-screen w-full bg-[#f4f1e8] relative flex items-center justify-center">
            {/* Paper Texture Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(101,67,33,0.08) 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(101,67,33,0.02) 2px, rgba(101,67,33,0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(101,67,33,0.02) 2px, rgba(101,67,33,0.02) 4px)
          `,
                    backgroundSize: "8px 8px, 32px 32px, 32px 32px",
                }}
            />

            {/* Loading Content */}
            <div className="relative z-10 text-center">
                {/* Vintage Phone Book Animation */}
                <div className="mb-8 relative">
                    <div className="w-24 h-32 mx-auto relative">
                        {/* Book Cover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-sm shadow-lg transform rotate-3 animate-pulse">
                            <div className="absolute inset-2 border-2 border-[#8b4513] rounded-sm">
                                <div className="flex flex-col items-center justify-center h-full text-[#8b4513]">
                                    <div className="text-xs font-bold mb-1">YELLOW</div>
                                    <div className="text-xs font-bold">PAGES</div>
                                </div>
                            </div>
                        </div>

                        {/* Animated Pages */}
                        <div className="absolute top-1 left-1 w-20 h-28 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute inset-0 bg-[#faf9f6] border border-[#d2b48c] rounded-sm"
                                    style={{
                                        transform: `translateX(${i * 2}px) translateY(${i * 1}px)`,
                                        animation: `pageFlip 2s ease-in-out infinite ${i * 0.2}s`,
                                        zIndex: 5 - i,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading Text with Typewriter Effect */}
                <div className="mb-6">
                    <h2 className="text-2xl font-serif text-[#8b4513] mb-2">Searching Directory...</h2>
                    <div className="flex items-center justify-center space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Vintage Progress Bar */}
                <div className="w-64 mx-auto">
                    <div className="h-3 bg-[#e6ddd4] border-2 border-[#8b4513] rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full animate-pulse"
                            style={{
                                width: "100%",
                                animation: "progressFill 3s ease-in-out infinite",
                            }}
                        />
                    </div>
                    <p className="text-sm text-[#8b4513] mt-2 font-serif">Loading business listings...</p>
                </div>

                {/* Rotating Compass Animation */}
                <div className="mt-8">
                    <div className="w-16 h-16 mx-auto relative">
                        <div className="absolute inset-0 border-4 border-[#8b4513] rounded-full bg-[#faf9f6] shadow-lg">
                            <div className="absolute inset-2 border border-[#d2b48c] rounded-full">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div
                                        className="w-1 h-6 bg-[#d4af37] rounded-full animate-spin origin-bottom"
                                        style={{ transformOrigin: "50% 100%" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes pageFlip {
          0%, 100% { transform: translateX(0) translateY(0) rotateY(0deg); }
          50% { transform: translateX(10px) translateY(-5px) rotateY(15deg); }
        }
        
        @keyframes progressFill {
          0% { width: 0%; }
          50% { width: 75%; }
          100% { width: 100%; }
        }
      `}</style>
        </div>
    )
}