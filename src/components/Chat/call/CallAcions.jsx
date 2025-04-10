// import {
//   ArrowIcon,
//   DialIcon,
//   MuteIcon,
//   SpeakerIcon,
//   VideoDialIcon,
// } from "../../../svg";

// export default function CallAcions({ endCall }) {
//   return (
//     <div className="h-22 w-full absolute bottom-0 z-40 px-1">
//       {/*Container*/}
//       <div className="relative bg-[#222] px-4 pt-6 pb-12 rounded-xl">
//         {/*Expand icon*/}
//         <button className="-rotate-90 scale-y-[300%] absolute top-1 left-1/2">
//           <ArrowIcon className="fill-dark_svg_2" />
//         </button>
//         {/*Actions*/}
//         <ul className="flex items-center justify-between">
//           <li>
//             <button className="btn_secondary">
//               <SpeakerIcon className="fill-white w-6" />
//             </button>
//           </li>
//           <li>
//             <button className="btn_secondary">
//               <VideoDialIcon className="fill-white w-14 mt-2.5" />
//             </button>
//           </li>
//           <li>
//             <button className="btn_secondary">
//               <MuteIcon className="fill-white w-5" />
//             </button>
//           </li>
//           <li onClick={() => endCall()}>
//             <button className="btn_secondary bg-red-600 rotate-[135deg]">
//               <DialIcon className="fill-white w-6" />
//             </button>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

import { ArrowIcon, DialIcon } from "../../../svg"; // Import các icon cần sử dụng: ArrowIcon và DialIcon

// Component CallActions hiển thị các hành động cuộc gọi, ví dụ nút kết thúc cuộc gọi
// Props nhận vào: endCall (hàm được gọi khi người dùng muốn kết thúc cuộc gọi)
export default function CallActions({ endCall }) {
  return (
    // Container ngoài, được định vị tuyệt đối ở dưới cùng của màn hình
    // với chiều cao 32, chiều rộng toàn bộ, z-index 40 và padding ngang (px-2)
    <div className="h-32 w-full absolute bottom-0 z-40 px-2">
      {/* Container chính bên trong với nền màu xám đậm, padding, bo tròn, bóng đổ, 
          chiếm 11/12 chiều rộng và được căn giữa theo chiều ngang */}
      <div className="relative bg-gray-800 px-6 pt-4 pb-10 rounded-3xl shadow-xl w-11/12 mx-auto">
        {/* Nút mở rộng (Expand Icon) */}
        {/* Icon Arrow được xoay -90 độ, phóng to 1.5 lần, được định vị tuyệt đối ở phía trên giữa container */}
        <button className="-rotate-90 scale-150 absolute top-2 left-1/2 transform -translate-x-1/2">
          <ArrowIcon className="fill-gray-400 hover:fill-white transition-colors" />
        </button>

        {/* Phần hành động */}
        {/* Danh sách các hành động được hiển thị dưới dạng danh sách ngang */}
        <ul className="flex items-center justify-center mt-6">
          <li onClick={endCall}>
            {/* Nút kết thúc cuộc gọi */}
            {/* Nút sử dụng class btn_secondary, nền màu đỏ, và xoay 135 độ (có thể tạo hiệu ứng trực quan cho hành động kết thúc) */}
            <button className="btn_secondary bg-red-600 rotate-[135deg]">
              <DialIcon className="fill-white w-8" />{" "}
              {/* Icon Dial thể hiện hành động kết thúc cuộc gọi */}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
