import { isAbsoluteUrl } from "@/helpers";
import { useForm } from "@inertiajs/react";
import {
    Button,
    Dropdown,
    FileInput,
    Label,
    Select,
    TextInput,
} from "flowbite-react";
import { useState } from "react";
import CreateUnitModal from "./CreateUnitModal";
export default function IngredientsForm({ ingredient, isEditing = false }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? ingredient.name : "",
        unit: isEditing ? ingredient.unit : "",
        quantity: isEditing ? ingredient.quantity : "",
        expiration_date: isEditing ? ingredient.expiration_date : "",
    });

    const [showCreateUnitModal, setShowCreateUnitModal] = useState(false);
    const [units, setUnits] = useState([]);

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.ingredients.update", ingredient.id), data, {
                forceFormData: true,
            });
        } else {
            post(route("admin.ingredients.store"), data, {
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
                        <Label htmlFor="name" value="ชื่อวัตถุดิบ" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        placeholder="กรุณากรอกชื่อวัตถุดิบ"
                        required
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="quantity" value="จำนวนวัตถุดิบ" />
                    </div>
                    <TextInput
                        id="quantity"
                        type="text"
                        placeholder="กรุณากรอกจำนวนวัตถุดิบ"
                        required
                        value={data.quantity}
                        onChange={(e) => setData("quantity", e.target.value)}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="unit" value="หน่วยวัตถุดิบ" />
                    </div>
                    <div className="relative">
                        <select
                            id="unit"
                            className="block w-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                            value={data.unit}
                            onChange={(e) => setData("unit", e.target.value)}
                        >
                            <option value="">เลือกหน่วยวัตถุดิบ</option>
                            {units.map((unit) => (
                                <option key={unit.id} value={unit.name}>
                                    {unit.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <Button
                                size="sm"
                                color="light"
                                onClick={() => setShowCreateUnitModal(true)}
                            >
                                เพิ่มหน่วยใหม่
                            </Button>
                        </div>
                    </div>
                </div>
                <CreateUnitModal
                    show={showCreateUnitModal}
                    onClose={() => setShowCreateUnitModal(false)}
                    onCreate={(newUnit) => {
                        setUnits((prevUnits) => [...prevUnits, newUnit]);
                        setData("unit", newUnit.name);
                    }}
                />
                {ingredient?.image && (
                    <img
                        src={
                            isAbsoluteUrl(ingredient.image)
                                ? ingredient.image
                                : `/images/ingredients/${ingredient.image}`
                        }
                        alt=""
                        className="mx-auto w-full"
                    />
                )}
                <div>
                    <div>
                        <Label htmlFor="image" value="อัพโหลดรูปภาพวัตถุดิบ" />
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
                            htmlFor="expiration_date"
                            value="วันหมดอายุวัตถุดิบ"
                        />
                    </div>
                    <TextInput
                        id="expiration_date"
                        type="date"
                        placeholder="กรุณากรอกวันหมดอายุวัตถุดิบ"
                        required
                        value={data.expiration_date}
                        onChange={(e) =>
                            setData("expiration_date", e.target.value)
                        }
                    />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
