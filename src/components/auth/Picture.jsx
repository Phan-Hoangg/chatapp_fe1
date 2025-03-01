import { useRef, useState } from "react";

export default function Picture({
  readablePicture,
  setReadablePicture,
  setPicture,
}) {
  const [error, setError] = useState("");
  const inputRef = useRef();
  const handlePicture = (e) => {
    let pic = e.target.files[0];
    if (
      pic.type !== "image/jpeg" &&
      pic.type !== "image/png" &&
      pic.type !== "image/webp"
    ) {
      setError(`${pic.name} định dạng ảnh này không được hỗ trợ.`);
      return;
    } else if (pic.size > 1024 * 1024 * 5) {
      setError(`${pic.name} kích thước của ảnh quá lớn , tối đa 5mb.`);
      return;
    } else {
      setError("");
      setPicture(pic);
      // reading the picture
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      reader.onload = (e) => {
        setReadablePicture(e.target.result);
      };
    }
  };
  const handleChangePic = () => {
    setPicture("");
    setReadablePicture("");
    inputRef.current.click();
  };
  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      <label htmlFor="picture" className="text-sm font-bold tracking-wide">
        Ảnh đại diện
      </label>
      {readablePicture ? (
        <div>
          <img
            src={readablePicture}
            alt="picture"
            className="w-20 h-20 object-cover rounded-full"
          />
          {/* change pic */}
          <div
            className="mt-2 w-20 p-2 dark:bg-dark_bg_3 rounded-md text-sm flex items-center justify-center cursor-pointer "
            onClick={() => handleChangePic()}
          >
            Remove
          </div>
        </div>
      ) : (
        <div
          className="w-full h-12 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          Upload picture
        </div>
      )}
      <input
        type="file"
        name="picture"
        id="picture"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePicture}
      />
      {/*error*/}
      <div className="mt-2">
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  );
}
