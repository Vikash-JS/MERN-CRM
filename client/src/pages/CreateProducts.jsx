import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreateProduct() {
	const [formData, setFormData] = useState({});
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	return (
		<div className="p-3 max-w-3xl mx-auto min-h-screen">
			<h1 className="text-center text-3xl my-7 font-semibold">Add Your Product</h1>
			<form className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 sm:flex-row justify-between">
					<TextInput
						type="text"
						placeholder="Title"
						required
						id="title"
						className="flex-1"
						onChange={handleChange}
					/>
					<Select id="category" onChange={handleChange}>
						<option value="uncategorized">Select a category</option>
						<option value="cloud">Cloud</option>
						<option value="iaas">Infra as a service</option>
						<option value="paas">Platform as a service</option>
						<option value="saas">Software as a service</option>
					</Select>
				</div>
				<div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
					<FileInput type="file" accept="image" />
					<Button outline type="button" size="sm" gradientDuoTone="purpleToBlue">
						Upload Image
					</Button>
				</div>
				<ReactQuill
					id="content"
					onChange={handleChange}
					required
					theme="snow"
					placeholder="Description..."
					className="h-52 mb-12"
				/>
				<Button type="submit" gradientDuoTone="purpleToPink" outline>
					Publish
				</Button>
			</form>
		</div>
	);
}
