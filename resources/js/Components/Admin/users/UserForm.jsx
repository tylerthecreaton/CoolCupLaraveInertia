import { useForm } from "@inertiajs/react";
import { Button, FileInput, Label, TextInput } from "flowbite-react";

export default function UserForm({ isEditing = false, user = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? user.name : "",
        email: isEditing ? user.email : "",
        username: isEditing ? user.username : "",
        password: "",
        password_confirmation: "",
        role: isEditing ? user.role : "employee",
        image: null,
    });

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.users.update", user.id), data, {
                forceFormData: true,
            });
        } else {
            post(route("admin.users.store"), data, {
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
                        <Label htmlFor="role" value="บทบาท" />
                    </div>
                    <select
                        id="role"
                        className="block px-4 py-2 w-full text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                    >
                        <option value="admin">ผู้ดูแลระบบ</option>
                        <option value="manager">ผู้จัดการ</option>
                        <option value="employee">พนักงาน</option>
                    </select>
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="name" value="ชื่อ-นามสกุล" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        placeholder="กรุณากรอกชื่อ-นามสกุล"
                        required
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                </div>
                <div>
                    <div>
                        <Label
                            htmlFor="file-upload-helper-text"
                            value="Upload file"
                        />
                    </div>
                    <FileInput
                        id="file-upload-helper-text"
                        helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="email1" value="อีเมล" />
                    </div>
                    <TextInput
                        id="email1"
                        type="email"
                        placeholder="กรุณากรอกอีเมล"
                        required
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="username" value="ชื่อผู้ใช้" />
                    </div>
                    <TextInput
                        id="username"
                        type="text"
                        placeholder="กรุณากรอกชื่อผู้ใช้"
                        required
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                    />
                </div>
                {isEditing && (
                    <div>
                        <div className="block mb-2">
                            <p className="text-sm text-red-500">* หากไม่ต้องการแก้ไขรหัสผ่านให้เว้นว่างไว้ไม่ต้องกรอก</p>
                        </div>
                    </div>
                )}
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="password1" value="รหัสผ่าน" />
                    </div>
                    <TextInput
                        id="password1"
                        type="password"
                        placeholder="กรุณากรอกรหัสผ่าน"
                        required={isEditing ? false : true}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label
                            htmlFor="password_confirmation"
                            value="ยืนยันรหัสผ่าน"
                        />
                    </div>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        placeholder="กรุณายืนยันรหัสผ่าน"
                        required={isEditing ? false : true}
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                </div>
                <Button type="submit">บันทึก</Button>
            </form>
        </div>
    );
}
