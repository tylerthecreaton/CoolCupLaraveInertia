import { Modal, Label, TextInput, Button, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { HiOutlineScale } from "react-icons/hi";

export default function EditUnitModal({ show, onClose, unit }) {
    const [name, setName] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [type, setType] = useState("ingredient");

    useEffect(() => {
        if (unit) {
            setName(unit.name);
            setAbbreviation(unit.abbreviation || "");
            setType(unit.type);
        }
    }, [unit]);

    const handleSubmit = (e) => {
        e.preventDefault();

        router.put(
            route("admin.units.update", unit.id),
            {
                name,
                abbreviation,
                type,
            },
            {
                onSuccess: () => {
                    onClose();
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: "แก้ไขหน่วยวัดเรียบร้อยแล้ว",
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

    if (!unit) return null;

    return (
        <Modal show={show} onClose={onClose} size="lg">
            <Modal.Header className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <HiOutlineScale className="w-6 h-6 text-gray-600" />
                    <span>แก้ไขหน่วยวัด</span>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    กำลังแก้ไขหน่วยวัด: <span className="font-medium">{unit.name}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="name" value="ชื่อหน่วยวัด" className="text-gray-700 text-sm font-medium" />
                            <TextInput
                                id="name"
                                type="text"
                                placeholder="เช่น มิลลิลิตร"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="abbreviation" value="คำย่อ" className="text-gray-700 text-sm font-medium" />
                            <TextInput
                                id="abbreviation"
                                type="text"
                                placeholder="เช่น ml"
                                value={abbreviation}
                                onChange={(e) => setAbbreviation(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="type" value="ประเภท" className="text-gray-700 text-sm font-medium" />
                            <Select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="ingredient">วัตถุดิบ (Ingredient)</option>
                                <option value="consumable">วัตถุดิบสิ้นเปลือง (Consumable)</option>
                            </Select>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button color="gray" onClick={onClose}>
                                ยกเลิก
                            </Button>
                            <Button
                                type="submit"
                                className="bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-300"
                            >
                                บันทึก
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
