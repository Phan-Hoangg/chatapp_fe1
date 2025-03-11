import DownloadIcon from "../../../../svg/Download";
export default function FileOthers({ file, type }) {
  // Hàm chuyển đổi kích thước file từ bytes sang KB, MB, GB...
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };
  return (
    <div className="bg-green_4 p-2 rounded-lg">
      {/*Container*/}
      <div className="flex justify-between gap-x-8">
        {/*File infos*/}
        <div className="flex items-center gap-2">
          <img
            src={`../../../../images/file/${type}.png`}
            alt=""
            className="w-8 object-contain"
          />
          <div className="flex flex-col gap-2">
            <h1>
              {file.original_filename}.{file.public_id.split(".")[1]}
            </h1>
            <span className="text-sm">
              {type} • {formatFileSize(file.bytes)}
            </span>
          </div>
        </div>
        {/*Download button*/}
        <a href={file.secure_url} target="_blank" download>
          <DownloadIcon />
        </a>
      </div>
    </div>
  );
}
