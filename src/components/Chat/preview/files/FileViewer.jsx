import { useSelector } from "react-redux";

// Hàm chuyển đổi kích thước file thành KB, MB, GB
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export default function FileViewer({ activeIndex }) {
  const { files } = useSelector((state) => state.chat);

  if (!files || !files[activeIndex]) {
    return (
      <div className="w-full max-w-[60%] flex justify-center items-center">
        <h1 className="text-xl text-gray-500">No file selected</h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[60%]">
      <div className="flex justify-center items-center">
        {files[activeIndex].type === "IMAGE" ? (
          <img
            src={files[activeIndex].fileData}
            alt=""
            className="max-w-[80%] object-contain hview"
          />
        ) : files[activeIndex].type === "VIDEO" ? (
          <video
            src={files[activeIndex].fileData}
            controls
            className="max-w-[80%] object-contain hview"
          ></video>
        ) : (
          <div className="min-w-full hview flex flex-col items-center justify-center">
            <img
              src={`../../../../images/file/${files[activeIndex].type}.png`}
              alt={files[activeIndex].type}
            />
            <h1 className="dark:text-dark_text_2 text-2xl">
              No preview available
            </h1>
            <span className="dark:text-dark_text_2">
              {formatFileSize(files[activeIndex]?.file?.size)} -{" "}
              {files[activeIndex]?.type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
