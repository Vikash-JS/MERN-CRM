import { Alert, Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice";

export default function DashProfile() {
	const { currentUser } = useSelector((state) => state.user);
	const [formData, setFormData] = useState({});
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
	const [updateUserError, setUpdateUserError] = useState(null);
	const dispatch = useDispatch();
	const filePickerRef = useRef();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImageFileUrl(URL.createObjectURL(file));
			setFormData({ ...formData, profilePicture: file });
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (Object.keys(formData).length === 0) {
			setUpdateUserError("No changes Made");
			return;
		}
		try {
			dispatch(updateStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) {
				dispatch(updateFailure(data.message));
			} else {
				dispatch(updateSuccess(data));
				setUpdateUserSuccess("Profile Updated Successfully");
			}
		} catch (err) {
			dispatch(updateFailure(err.message));
		}
	};
	console.log(formData);
	return (
		<div className="max-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="file"
					accept="image/*"
					ref={filePickerRef}
					onChange={handleImageChange}
					hidden
				/>
				<div
					onClick={() => filePickerRef.current.click()}
					className="w-32 h-32 self-center curson-pointer shadow-md overflow-hidden rounded-full ">
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
					onChange={handleChange}
				/>
				<TextInput
					type="email"
					id="username"
					placeholder="email"
					defaultValue={currentUser.email}
					onChange={handleChange}
				/>
				<TextInput
					type="password"
					id="password"
					onChange={handleChange}
					placeholder="password"
				/>
				<Button type="submit" gradientDuoTone="purpleToPink" outline>
					Update
				</Button>
			</form>
			<div className="text-red-500 flex justify-between mt-5 ">
				<span className="cursor-pointer">Delete Account</span>
				<span className="cursor-pointer">Sign Out</span>
			</div>
			{updateUserSuccess && (
				<Alert color="success" className="mt-5">
					{updateUserSuccess}
				</Alert>
			)}
			{updateUserError && (
				<Alert color="failure" className="mt-5">
					{updateUserError}
				</Alert>
			)}
		</div>
	);
}
