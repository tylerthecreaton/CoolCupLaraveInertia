import { Modal, Label, TextInput, Button, Select } from "flowbite-react";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { HiOutlineScale, HiInformationCircle } from "react-icons/hi";
import Swal from "sweetalert2";

export default function CreateUnitModal({ show, onClose }) {
    const [name, setName] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [type, setType] = useState("ingredient");

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(
            route("admin.units.store"),
            {
                name,
                abbreviation,
                type,
            },
            {
                onSuccess: () => {
                    onClose();
                    setName("");
                    setAbbreviation("");
                    setType("ingredient");
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: "เพิ่มหน่วยวัดเรียบร้อยแล้ว",
                        icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        text: Object.values(errors)[0],
                        icon: "error",
                    });
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={onClose} size="lg">
            <form onSubmit={handleSubmit}>
                <Modal.Header className="border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <HiOutlineScale className="w-6 h-6 text-gray-600" />
                        <span className="text-xl font-semibold text-gray-900">เพิ่มหน่วยวัดใหม่</span>
                    </div>
                </Modal.Header>
                <Modal.Body className="space-y-6">
                    {/* Info Alert */}
                    <div className="flex p-4 text-sm text-blue-800 border-l-4 border-blue-300 bg-blue-50">
                        <HiInformationCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                        <span>
                            หน่วยวัดที่เพิ่มจะถูกนำไปใช้ในการกำหนดปริมาณของวัตถุดิบ และวัตถุดิบสิ้นเปลือง
                            กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="mb-2 block">
                                ชื่อหน่วยวัด
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <TextInput
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="เช่น กิโลกรัม, ลิตร"
                                required
                                className="mt-1"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                ระบุชื่อหน่วยวัดที่ต้องการใช้ในระบบ
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="abbreviation" className="mb-2 block">
                                ตัวย่อ
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <TextInput
                                id="abbreviation"
                                value={abbreviation}
                                onChange={(e) => setAbbreviation(e.target.value)}
                                placeholder="เช่น กก., ล."
                                required
                                className="mt-1"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                ระบุตัวย่อของหน่วยวัด เพื่อความสะดวกในการแสดงผล
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="type" className="mb-2 block">
                                ประเภท
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                className="mt-1"
                            >
                                <option value="ingredient">วัตถุดิบ</option>
                                <option value="consumable">วัตถุดิบสิ้นเปลือง</option>
                            </Select>
                            <p className="mt-1 text-sm text-gray-500">
                                เลือกประเภทของหน่วยวัด เพื่อจำแนกการใช้งาน
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-t border-gray-200">
                    <div className="flex justify-end gap-2">
                        <Button
                            color="gray"
                            onClick={onClose}
                            className="px-4"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            gradientDuoTone="cyanToBlue"
                            className="px-4"
                        >
                            บันทึกหน่วยวัด
                        </Button>
                    </div>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
