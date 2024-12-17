import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button, FileInput, Label, Select, TextInput } from "flowbite-react";
export default function ProductsForm({

    categories,
    isEditing = false,
    product = null,
}) {
    const { data, setData, post, put , processing, errors } = useForm({
        name: isEditing ? product.name : "",
        image: null,
        description: isEditing ? product.description : "",
        cost_price: isEditing ? product.cost_price : "",
        sale_price: isEditing ? product.sale_price : "",
        category_id: isEditing ? product.category_id : "",
    });

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.products.update", product.id), data, {
                forceFormData: true,
            });
        } else {
            post(route("admin.products.store"), data, {
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
                        <Label htmlFor="name" value="ชื่อสินค้า" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        placeholder="กรุณากรอกชื่อสินค้า"
                        required
                        color={errors.name ? "failure" : undefined}
                        value={data.name}
                        helperText={
                            <span>
                                {errors.name && <span>{errors.name}</span>}
                            </span>
                        }
                        onChange={(e) => setData("name", e.target.value)}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="category" value="หมวดหมู่" />
                    </div>
                    <Select
                        id="category"
                        required
                        value={data.category_id}
                        name="category_id"
                        onChange={(e) => setData("category_id", e.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                </div>
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
                    <div>
                        <Label htmlFor="cost_price" value="ราคาต้นทุน" />
                    </div>
                    <TextInput
                        id="cost_price"
                        type="number"
                        placeholder="กรุณากรอกราคาต้นทุน"
                        required
                        value={data.cost_price}
                        onChange={(e) => setData("cost_price", e.target.value)}
                    />
                    <div>
                        <Label htmlFor="sale_price" value="ราคาขาย" />
                    </div>
                    <TextInput
                        id="sale_price"
                        type="number"
                        placeholder="กรุณากรอกราคาขาย"
                        required
                        value={data.sale_price}
                        onChange={(e) => setData("sale_price", e.target.value)}
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
