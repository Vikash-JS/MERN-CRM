import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signoutSuccess,
	updateFailure,
	updateStart,
	updateSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
	const { currentUser, error, loading } = useSelector((state) => state.user);
	const [formData, setFormData] = useState({});
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
	const [updateUserError, setUpdateUserError] = useState(null);
	const [showModal, setShowModal] = useState(false);
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

	const handleDeleteUser = async () => {
		setShowModal(false);
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				dispatch(deleteUserFailure(data.message));
			} else {
				dispatch(deleteUserSuccess(data));
			}
		} catch (err) {
			dispatch(deleteUserFailure(err.message));
		}
	};

	const handleSignOut = async () => {
		try {
			const res = await fetch("/api/user/signout", {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signoutSuccess());
			}
		} catch (err) {
			console.log(err);
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
				<Button type="submit" disabled={loading} gradientDuoTone="purpleToPink" outline>
					{loading ? "Loading ..." : "Update"}
				</Button>
				{currentUser.isAdmin && (
					<Link to="/create-product">
						<Button type="button" className="w-full" gradientDuoTone="purpleToPink">
							Add Products
						</Button>
					</Link>
				)}
			</form>
			<div className="text-red-500 flex justify-between mt-5 ">
				<span onClick={() => setShowModal(true)} className="cursor-pointer">
					Delete Account
				</span>
				<span onClick={handleSignOut} className="cursor-pointer">
					Sign Out
				</span>
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
			{error && (
				<Alert color="failure" className="mt-5">
					{error}
				</Alert>
			)}
			<Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto " />
						<h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
							Are you sure you want to delete your account?
						</h3>
						<div className="flex justify-center gap-4">
							<Button color="failure" onClick={handleDeleteUser}>
								Yes Sure
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								No, Cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
