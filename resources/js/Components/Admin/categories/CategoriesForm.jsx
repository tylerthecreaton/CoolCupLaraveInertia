import { isAbsoluteUrl } from "@/helpers";
import { useForm } from "@inertiajs/react";
import { Button, FileInput, Label, TextInput } from "flowbite-react";

export default function CategoriesForm({ category, isEditing = false }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? category.name : "",
        image: null,
        description: isEditing ? category.description : "",
    });

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.categories.update", category.id), data, {
                forceFormData: true,
            });
        } else {
            post(route("admin.categories.store"), data, {
                forceFormData: true,
            });
        }
    };
    return (
        <div className="container px-4 py-8 mx-auto mt-5 bg-white rounded-md sm:px-8">
            <form
                className="flex flex-col gap-4 mx-auto max-w-md"
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="name" value="ชื่อหมวดหมู่" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        placeholder="กรุณากรอกชื่อหมวดหมู่"
                        required
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                </div>
                {category?.image && (
                    <img
                        src={
                            isAbsoluteUrl(category.image)
                                ? category.image
                                : `/images/categories/${category.image}`
                        }
                        alt=""
                        className="mx-auto w-full"
                    />
                )}
                <div>
                    <div>
                        <Label htmlFor="image" value="อัพโหลดรูปภาพ" />
                    </div>
                    <FileInput
                        id="image"
                        helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label
                            htmlFor="description"
                            value="คําอธิบายหมวดหมู่"
                        />
                    </div>
                    <TextInput
                        id="description"
                        type="text"
                        placeholder="กรุณากรอกคำอธิบายหมวดหมู่"
                        required
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
