// // components/Laptop.js
// const Laptop=()=> {
//     return (
//       <div className="relative w-full">
//         <div className="relative w-4/5 mx-auto border border-opacity-50 border-black shadow-lg shadow-black/50 bg-[#1a1a1a] rounded-t-lg">
//           <div className="relative pt-[62.5%]"></div>
//           <div className="absolute top-[3.5%] left-[2.5%] bottom-[3.5%] right-[2.5%] overflow-hidden border border-black border-t-[#202020] border-r-[#282828] border-b-[#282828] border-l-[#202020] rounded bg-black shadow-inner shadow-white/5">
//             {/* Place content here */}
//           </div>
//           <div className="absolute top-0 left-0 w-full h-full rounded-t-lg bg-gradient-to-br from-white/17.5% to-transparent"></div>
//           <div className="absolute top-0 left-0 w-full h-full rounded-t-lg bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
//           <div className="absolute top-[-4px] left-2% w-4/5 h-[2px] bg-gradient-to-br from-transparent via-white/50 to-transparent"></div>
//           <div className="absolute top-2% left-[-4px] w-[2px] h-4/5 bg-gradient-to-br from-transparent via-white/25 to-transparent"></div>
//         </div>
//         <div className="relative w-full h-[0.25vw] bg-gradient-to-r from-white/50 via-black/75 via-black/33 to-transparent rounded-t-sm">
//           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/5 h-[0.25vw] bg-gradient-to-r from-black via-black/50 to-black rounded shadow-inner shadow-black/20"></div>
//         </div>
//         <div className="relative w-full h-[1.25vw] bg-gradient-to-r from-white/35 via-black/75 via-black/50 to-transparent rounded-b-[33%] shadow-lg shadow-black/50">
//           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/5 h-[0.5vw] bg-gradient-to-t from-white/75 via-black/50 to-black rounded-b-md shadow-inner shadow-black/20"></div>
//         </div>
//       </div>
//     );
//   }

// export default Laptop;

import React from "react";

const Laptop = () => {
  return (
    <div className="macbook mx-auto max-w-[800px] p-4 md:p-6">
      <div className="screen relative mx-auto w-[80%] bg-black rounded-[3%_3%_0.5%_0.5%/5%]">
        <div className="viewport absolute inset-0 m-[4.3%_3.2%] bg-[#333]">
          <iframe
            width="w-[100%]"
            src="https://www.youtube.com/embed/HrSm2F-2O5Y"
            title='"He Was In My Mud" | Suits'
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
        <div className="before:block before:pt-[67%] before:border-[2px] before:border-[#cacacc] before:rounded-[3%_3%_0.5%_0.5%/5%] before:shadow-[0_0_0_1px_rgba(0,0,0,0.8)_inset,0_0_1px_2px_rgba(255,255,255,0.3)_inset]"></div>
        <div className="after:absolute after:bottom-[0.75%] after:left-[0.5%] after:pt-[1%] after:w-[99%] after:border-t-[2px] after:border-[rgba(255,255,255,0.15)]"></div>
      </div>

      <div className="base relative">
        <div className="before:block before:pt-[3.3%] before:bg-[linear-gradient(#eaeced,#edeef0_55%,#fff_55%,#8a8b8f_56%,#999ba0_61%,#4B4B4F_84%,#262627_89%,rgba(0,0,0,.01)_98%)] before:rounded-[0_0_10%_10%/0_0_50%_50%]"></div>
        <div className="after:absolute after:top-0 after:h-[53%] after:w-full after:bg-[linear-gradient(90deg,rgba(0,0,0,0.5),rgba(255,255,255,0.8)_0.5%,rgba(0,0,0,0.4)_3.3%,transparent_15%,rgba(255,255,255,0.8)_50%,transparent_85%,rgba(0,0,0,0.4)_96.7%,rgba(255,255,255,0.8)_99.5%,rgba(0,0,0,0.5)_100%)]"></div>
      </div>
      <div className="notch mx-auto mt-[-3.5%] z-2 relative w-[14%] bg-[#ddd] rounded-[0_0_7%_7%/0_0_95%_95%] shadow-[-5px_-1px_3px_rgba(0,0,0,0.2)_inset,5px_-1px_3px_rgba(0,0,0,0.2)_inset]">
        <div className="before:block before:pt-[10%]"></div>
      </div>
    </div>
  );
};

export default Laptop;
