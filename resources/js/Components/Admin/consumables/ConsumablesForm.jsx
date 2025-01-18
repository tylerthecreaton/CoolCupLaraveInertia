import React from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Button, Textarea, Select } from "flowbite-react";

export default function ConsumablesForm({ consumable }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        name: consumable?.name || "",
        quantity: consumable?.quantity || "0",
        unit: consumable?.unit || "",
        is_depend_on_sale: consumable?.is_depend_on_sale || false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (consumable) {
            patch(route("admin.consumables.update", consumable.id));
        } else {
            post(route("admin.consumables.store"));
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">
                {consumable ? "Edit Consumable" : "Create New Consumable"}
            </h2>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="quantity" value="Quantity" />
                        <TextInput
                            id="quantity"
                            type="number"
                            name="quantity"
                            value={data.quantity}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("quantity", e.target.value)}
                            required
                            min="0"
                        />
                        <InputError message={errors.quantity} className="mt-2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="unit" value="Unit" />
                        <TextInput
                            id="unit"
                            type="text"
                            name="unit"
                            value={data.unit}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("unit", e.target.value)}
                            placeholder="e.g., pieces, boxes"
                        />
                        <InputError message={errors.unit} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="is_depend_on_sale" value="Depends on Sales" />
                        <Select
                            id="is_depend_on_sale"
                            name="is_depend_on_sale"
                            value={data.is_depend_on_sale}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("is_depend_on_sale", e.target.value === "true")}
                        >
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                        </Select>
                        <InputError message={errors.is_depend_on_sale} className="mt-2" />
                    </div>
                </div>
                <div className="flex items-center justify-end pt-4">
                    <Button type="submit" disabled={processing} color="blue" size="lg">
                        {consumable ? "Update Consumable" : "Create Consumable"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
