import { FaDiscord, FaRedditAlien, FaTwitter, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#181824] border-t border-[#00ffb3] pt-10 pb-4 px-4 text-gray-400 w-[100vw] bottom-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Left: Brand and tagline */}
          <div>
            <div className="text-[#00ffb3] text-2xl font-extrabold mb-1">{'>_ MEME PUNK'}</div>
            <div className="tracking-widest text-sm mb-6 md:mb-0">RENDERING DIGITAL HUMOR SINCE 2077</div>
          </div>
          {/* Right: Social icons */}
          <div className="flex space-x-6 text-3xl justify-center md:justify-end mb-6 md:mb-0">
            <a href="#" className="hover:text-[#00ffb3]" aria-label="Discord"><FaDiscord /></a>
            <a href="#" className="hover:text-[#ff00ea]" aria-label="Reddit"><FaRedditAlien /></a>
            <a href="#" className="hover:text-[#00acee]" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="hover:text-[#fff]" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>
        <hr className="my-6 border-[#222]" />
        <div className="flex flex-col md:flex-row md:justify-between text-xs text-gray-500">
          <div className="mb-2 md:mb-0">
            SYSTEM STATUS: <span className="text-[#00ffb3]">ONLINE</span> | PING: <span className="text-[#00ffb3]">42MS</span> | NODES: <span className="text-[#00ffb3]">1337</span>
          </div>
          <div>
            © 2077 CYBER_MEMES COLLECTIVE. ALL RIGHTS RESERVED OR WHATEVER.
          </div>
        </div>
      </div>
    </footer>
  );
}