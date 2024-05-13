import { Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {};
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />
        <div
          onClick={() => filePickerRef.current.click()}
          className="w-32 h-32 self-center curson-pointer shadow-md overflow-hidden rounded-full "
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full border-8 border-[lightgray] object-cover"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="username"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToPink" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5 ">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
