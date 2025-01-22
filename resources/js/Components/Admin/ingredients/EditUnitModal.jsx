import { Modal, Button, TextInput, Label, Select } from "flowbite-react";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { HiOutlineScale } from "react-icons/hi";

export default function EditUnitModal({ isOpen, setIsOpen, unit }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        abbreviation: "",
        type: "",
    });

    useEffect(() => {
        if (unit) {
            setData({
                name: unit.name,
                abbreviation: unit.abbreviation || "",
                type: unit.type,
            });
        }
    }, [unit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.units.update", unit?.id), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
                Swal.fire({
                    title: "สำเร็จ!",
                    text: "แก้ไขหน่วยวัดเรียบร้อยแล้ว",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: "กรุณาลองใหม่อีกครั้ง",
                    icon: "error",
                });
            },
        });
    };

    const handleClose = () => {
        setIsOpen(false);
        reset();
    };

    if (!unit) return null;

    return (
        <Modal show={isOpen} onClose={handleClose} size="lg">
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name" value="ชื่อหน่วยวัด" className="text-gray-700 text-sm font-medium" />
                            <TextInput
                                id="name"
                                type="text"
                                placeholder="เช่น มิลลิลิตร"
                                required
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                color={errors.name ? "failure" : "gray"}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="abbreviation" value="คำย่อ" className="text-gray-700 text-sm font-medium" />
                            <TextInput
                                id="abbreviation"
                                type="text"
                                placeholder="เช่น ml"
                                value={data.abbreviation}
                                onChange={(e) => setData("abbreviation", e.target.value)}
                                color={errors.abbreviation ? "failure" : "gray"}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="type" value="ประเภท" className="text-gray-700 text-sm font-medium" />
                            <Select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData("type", e.target.value)}
                                color={errors.type ? "failure" : "gray"}
                                className="mt-1"
                            >
                                <option value="ingredient">วัตถุดิบ (Ingredient)</option>
                                <option value="consumable">วัตถุดิบสิ้นเปลือง (Consumable)</option>
                            </Select>
                        </div>

                        {(errors.name || errors.abbreviation || errors.type) && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                {errors.name && (
                                    <p className="flex items-center space-x-1">
                                        <span>•</span>
                                        <span>{errors.name}</span>
                                    </p>
                                )}
                                {errors.abbreviation && (
                                    <p className="flex items-center space-x-1">
                                        <span>•</span>
                                        <span>{errors.abbreviation}</span>
                                    </p>
                                )}
                                {errors.type && (
                                    <p className="flex items-center space-x-1">
                                        <span>•</span>
                                        <span>{errors.type}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button color="gray" onClick={handleClose}>
                                ยกเลิก
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-300"
                            >
                                {processing ? "กำลังบันทึก..." : "บันทึก"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
