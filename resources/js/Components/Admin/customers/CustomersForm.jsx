import { useForm } from "@inertiajs/react";
import { Button, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";

export default function CustomersForm({ isEditing = false, user = null }) {
    const { data, setData, post, processing, errors } = useForm({
        name: isEditing ? user.name : "",
        phone_number: isEditing ? user.phone_number : "",
        birthdate: isEditing ? user.birthdate : "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            isEditing
                ? route("admin.customers.update", customer.id)
                : route("admin.customers.store"),
            data,
            {
                forceFormData: true,
            }
        );
    };
    return (
        <div className="container px-4 py-8 mx-auto mt-5 bg-white rounded-md sm:px-8">
            <form
                className="flex flex-col gap-4 mx-auto max-w-md"
                onSubmit={handleSubmit}
            >
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
                <div className="flex gap-2 items-center">
                    <div className="block flex-1 mb-2">
                        <Label htmlFor="phone_number" value="เบอร์โทร" />
                    </div>
                    <div className="block mb-2">
                        <Button
                            type="button"
                            onClick={() => {
                                if (data.phone_number) {
                                    Swal.fire({
                                        title: "ตรวจสอบเบอร์โทร",
                                        text: `เบอร์โทร ${data.phone_number} ถูกใช้งานแล้วหรือไม่`,
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "ใช่",
                                        cancelButtonText: "ไม่",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            setData("is_phone_number_checked", true);
                                        }
                                    });
                                }
                            }}
                        >
                            ตรวจสอบ
                        </Button>
                    </div>
                </div>
                <div>
                    <TextInput
                        id="phone_number"
                        type="text"
                        placeholder="กรุณากรอกเบอร์โทร"
                        required
                        value={data.phone_number}
                        onChange={(e) => setData("phone_number", e.target.value)}
                        disabled={data.is_phone_number_checked}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="birthdate" value="วัน/เดือน/ปีเกิด" />
                    </div>
                    <TextInput
                        id="birthdate"
                        type="date"
                        placeholder="กรุณากรอกวัน/เดือน/ปีเกิด"
                        required
                        value={data.birthdate}
                        onChange={(e) => setData("birthdate", e.target.value)}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
