export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
          GotTalent-Virtual
        </h1>
        <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl mb-8">
          Discover and showcase amazing talents from around the world. 
          Your stage is virtual, your audience is global.
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-colors">
            Join as a Performer
          </button>
          <button className="px-8 py-3 bg-transparent border-2 border-white/30 hover:border-white/60 rounded-full font-semibold transition-colors">
            Watch Performances
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-neutral-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎤</div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Talent</h3>
              <p className="text-neutral-400">Share your performance video with our global community</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Get Discovered</h3>
              <p className="text-neutral-400">Receive votes and feedback from talent scouts worldwide</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Win Prizes</h3>
              <p className="text-neutral-400">Compete for amazing prizes and recognition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-neutral-500">
        <p>© 2026 GotTalent-Virtual. All rights reserved.</p>
      </footer>
    </main>
  );
}
