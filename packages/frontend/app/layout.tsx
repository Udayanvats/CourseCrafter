import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./_components/navbar";
import NextTopLoader from 'nextjs-toploader';

const inter = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseCrafter",
  description: "Generate courses from your PPTs and PDFs with the help of AI  ",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{
        <div className="bg-background w-full h-full min-h-screen">

          {children}
          <NextTopLoader  color="linear-gradient(to right, rgba(99, 102, 241, 1), rgba(168, 85, 247, 1))" />

          <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
          
          />
        </div>
      }</body>
    </html>
  );
}
