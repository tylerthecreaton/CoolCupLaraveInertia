import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";

export default function UserForm({ isEditing = false, user = null, errors = {} }) {
    const { data, setData, processing } = useForm({
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

        Swal.fire({
            title: isEditing ? "ยืนยันการแก้ไข?" : "ยืนยันการเพิ่ม?",
            text: isEditing 
                ? "คุณต้องการแก้ไขข้อมูลผู้ใช้นี้ใช่หรือไม่?" 
                : "คุณต้องการเพิ่มผู้ใช้ใหม่ใช่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                if (isEditing) {
                    router.post(route("admin.users.update", user.id), {
                        _method: 'PUT',
                        ...data,
                    }, {
                        forceFormData: true,
                        onSuccess: () => {
                            Swal.fire({
                                title: "สำเร็จ!",
                                text: "แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว",
                                icon: "success",
                                timer: 1500
                            });
                        },
                        onError: (errors) => {
                            console.log('Submission Errors:', errors);
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด!",
                                text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                                icon: "error"
                            });
                        }
                    });
                } else {
                    router.post(route("admin.users.store"), {
                        ...data,
                    }, {
                        forceFormData: true,
                        onSuccess: () => {
                            Swal.fire({
                                title: "สำเร็จ!",
                                text: "เพิ่มผู้ใช้ใหม่เรียบร้อยแล้ว",
                                icon: "success",
                                timer: 1500
                            });
                        },
                        onError: (errors) => {
                            console.log('Submission Errors:', errors);
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด!",
                                text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                                icon: "error"
                            });
                        }
                    });
                }
            }
        });
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
                        className={`block px-4 py-2 w-full text-gray-700 bg-white rounded-md border shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                            errors?.role ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                    >
                        <option value="admin">ผู้ดูแลระบบ</option>
                        <option value="manager">ผู้จัดการ</option>
                        <option value="employee">พนักงาน</option>
                    </select>
                    {errors?.role && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.role}
                        </p>
                    )}
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
                        color={errors?.name ? "failure" : "gray"}
                        helperText={errors?.name}
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
                        helperText={errors?.image ? errors.image : "SVG, PNG, JPG or GIF (MAX. 800x400px)."}
                        accept="image/*"
                        onChange={handleFileChange}
                        color={errors?.image ? "failure" : "gray"}
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
                        color={errors?.email ? "failure" : "gray"}
                        helperText={errors?.email}
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
                        color={errors?.username ? "failure" : "gray"}
                        helperText={errors?.username}
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
                        <Label htmlFor="password" value="รหัสผ่าน" />
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required={!isEditing}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        color={errors?.password ? "failure" : "gray"}
                        helperText={errors?.password}
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
                        placeholder="••••••••"
                        required={!isEditing}
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        color={errors?.password_confirmation ? "failure" : "gray"}
                        helperText={errors?.password_confirmation}
                    />
                </div>
                <Button type="submit">บันทึก</Button>
            </form>
        </div>
    );
}
