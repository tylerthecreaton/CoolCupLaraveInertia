import { useEffect } from "react";
import { router, useForm } from "@inertiajs/react";
import { Button, FileInput, Label, Select, TextInput } from "flowbite-react";
import { isAbsoluteUrl } from "@/helpers";
import Swal from "sweetalert2";
import ProductIngredientsForm from "./ProductIngredientsForm";
import ProductConsumablesForm from "./ProductConsumablesForm";

export default function ProductsForm({
    categories,
    ingredients = [],
    consumables = [],
    productIngredients = [],
    productConsumables = [],
    isEditing = false,
    product = null,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? product.name : "",
        image: null,
        description: isEditing ? product.description : "",
        cost_price: isEditing ? product.cost_price : "",
        sale_price: isEditing ? product.sale_price : "",
        category_id: isEditing ? product.category_id : "",
    });

    useEffect(() => {
        if (isEditing && product) {
            setData('category_id', product.category_id);
        }
    }, []);

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create form data object
        const formData = new FormData();

        // Add form fields
        formData.append('name', data.name);
        formData.append('category_id', data.category_id);
        formData.append('description', data.description || '');
        formData.append('cost_price', data.cost_price);
        formData.append('sale_price', data.sale_price);

        // Only append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        Swal.fire({
            title: isEditing ? "ยืนยันการแก้ไข?" : "ยืนยันการเพิ่ม?",
            text: isEditing
                ? "คุณต้องการแก้ไขข้อมูลสินค้านี้ใช่หรือไม่?"
                : "คุณต้องการเพิ่มสินค้าใหม่ใช่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                if (isEditing) {
                    router.post(route("admin.products.update", product.id), {
                        _method: 'PUT',
                        name: data.name,
                        category_id: data.category_id,
                        description: data.description || '',
                        cost_price: data.cost_price,
                        sale_price: data.sale_price,
                        ...(data.image && { image: data.image })
                    }, {
                        onError: (errors) => {
                            console.log('Submission Errors:', errors);
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด!",
                                text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                                icon: "error"
                            });
                        },
                        onSuccess: () => {
                            console.log('Update successful');
                            Swal.fire({
                                title: "สำเร็จ!",
                                text: "แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว",
                                icon: "success",
                                timer: 1500
                            });
                        },
                        forceFormData: true
                    });
                } else {
                    router.post(route("admin.products.store"), {
                        name: data.name,
                        category_id: data.category_id,
                        description: data.description || '',
                        cost_price: data.cost_price,
                        sale_price: data.sale_price,
                        ...(data.image && { image: data.image })
                    }, {
                        onError: (errors) => {
                            console.log('Submission Errors:', errors);
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด!",
                                text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                                icon: "error"
                            });
                        },
                        onSuccess: () => {
                            Swal.fire({
                                title: "สำเร็จ!",
                                text: "เพิ่มสินค้าใหม่เรียบร้อยแล้ว",
                                icon: "success",
                                timer: 1500
                            });
                        },
                        forceFormData: true
                    });
                }
            }
        });
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        console.log('Selected Category:', value);
        setData('category_id', value);
    };

    return (
        <div className="container px-4 py-8 mx-auto mt-5 bg-white rounded-md sm:px-8">
            <form
                className="flex flex-col gap-4 mx-auto max-w-lg"
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="name" value="ชื่อสินค้า" />
                    </div>
                    <TextInput
                        id="name"
                        name="name"
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
                        value={data.category_id || ''}
                        name="category_id"
                        onChange={(e) => setData("category_id", e.target.value)}
                    >
                        <option value="" disabled>
                            กรุณาเลือกหมวดหมู่สินค้า
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                    {errors.category_id && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.category_id}
                        </p>
                    )}
                </div>
                {product?.image && (
                    <img
                        src={
                            isAbsoluteUrl(product.image)
                                ? product.image
                                : `/images/products/${product.image}`
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
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        color={errors.image ? "failure" : undefined}
                        helperText={
                            <span>
                                {errors.image && (
                                    <span>
                                        {errors.image}
                                    </span>
                                )}
                            </span>
                        }
                    />
                    <span className="text-sm text-gray-500">
                        อัพโหลดไฟล์รูปภาพ SVG, PNG, JPG , JPEG (MAX. 800x400px)
                    </span>
                </div>
                <div>
                    <div>
                        <Label htmlFor="cost_price" value="ราคาต้นทุน" />
                    </div>
                    <TextInput
                        id="cost_price"
                        name="cost_price"
                        type="number"
                        placeholder="กรุณากรอกราคาต้นทุน"
                        required
                        value={data.cost_price}
                        onChange={(e) => setData("cost_price", e.target.value)}
                        helperText={
                            <span>
                                {errors.cost_price && (
                                    <span>
                                        {errors.cost_price}
                                    </span>
                                )}
                            </span>
                        }
                    />
                    <div>
                        <Label htmlFor="sale_price" value="ราคาขาย" />
                    </div>
                    <TextInput
                        id="sale_price"
                        name="sale_price"
                        type="number"
                        placeholder="กรุณากรอกราคาขาย"
                        required
                        value={data.sale_price}
                        onChange={(e) => setData("sale_price", e.target.value)}
                        helperText={
                            <span>
                                {errors.sale_price && (
                                    <span>
                                        {errors.sale_price}
                                    </span>
                                )}
                            </span>
                        }
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label
                            htmlFor="description"
                            value="คําอธิบายสินค้า"
                        />
                    </div>
                    <TextInput
                        id="description"
                        name="description"
                        type="text"
                        placeholder="กรุณากรอกคำอธิบายสินค้า"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                </div>
                <Button type="submit">บันทึก</Button>
                <ProductIngredientsForm
                    product={product}
                    ingredients={ingredients}
                    productIngredients={productIngredients}
                />
                <ProductConsumablesForm
                    product={product}
                    consumables={consumables}
                    productConsumables={productConsumables}
                />
            </form>
        </div>
    );
}
