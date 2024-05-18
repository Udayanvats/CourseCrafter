import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black-800 text-white py-10">
      <div className="container mx-auto px-4 flex justify-between items-start">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="font-bold text-xl">Coursecrafter</h2>
            <p className="text-gray-400">
              Generate notes from PPTs and PDFs using AI
            </p>
          </div>
          <div>
            <a
              href="mailto:hi@cursor.sh"
              className="text-gray-400 hover:text-white"
            >
              hi@Coursecrafter.sh
            </a>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 text-gray-400 hover:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.56c-.89.39-1.84.65-2.84.77 1.02-.61 1.8-1.57 2.17-2.72-.95.56-2.01.97-3.14 1.19-.9-.96-2.18-1.56-3.6-1.56-2.73 0-4.94 2.21-4.94 4.94 0 .39.04.77.13 1.14C7.69 8.09 4.07 6.13 1.64 3.16c-.42.72-.66 1.56-.66 2.45 0 1.69.86 3.18 2.17 4.06-.8-.03-1.56-.25-2.22-.61v.06c0 2.36 1.68 4.33 3.92 4.78-.41.11-.84.17-1.28.17-.31 0-.61-.03-.91-.08.61 1.91 2.39 3.29 4.5 3.33-1.65 1.3-3.72 2.08-5.98 2.08-.39 0-.78-.02-1.17-.07C2.11 19.29 4.6 20 7.29 20c8.75 0 13.54-7.25 13.54-13.54 0-.21 0-.42-.01-.63.93-.67 1.73-1.5 2.37-2.45z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 text-gray-400 hover:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452H17.3v-5.569c0-1.327-.026-3.036-1.848-3.036-1.85 0-2.132 1.444-2.132 2.942v5.663H10.175v-11.5h3.01v1.571h.042c.419-.797 1.445-1.64 2.973-1.64 3.178 0 3.764 2.09 3.764 4.808v6.76zM5.337 8.433c-.975 0-1.764-.788-1.764-1.762s.789-1.764 1.764-1.764c.975 0 1.763.789 1.763 1.764 0 .974-.788 1.762-1.763 1.762zm1.636 12.019H3.7v-11.5h3.273v11.5zM22.225 0H1.771C.792 0 0 .792 0 1.771v20.452C0 23.208.792 24 1.771 24h20.452C23.208 24 24 23.208 24 22.225V1.771C24 .792 23.208 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-col space-y-2 justify-center items-center text-gray-400">
          <a href="#" className="hover:text-white">
            GitHub
          </a>
        </div>
      </div>
      <div className="text-center mt-10 text-gray-500">
        <p>
          Made with <span className="text-red-500">❤</span> by Anysphere
        </p>
      </div>
    </footer>
  );
};

export default Footer;
