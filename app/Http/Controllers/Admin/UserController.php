<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usersPaginate = User::paginate(5);
        return Inertia::render("Admin/users/index", compact("usersPaginate"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Admin/users/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            "name" => "required|min:3",
            'role' => 'required|in:admin,manager,employee',
            "email" => "required|email|unique:users",
            'username' => 'required|min:3|unique:users',
            "password" => "required|confirmed|min:8",
            'password_confirmation' => 'required|min:8',
        ];
        $message = [
            "name.required" => "กรุณากรอกชื่อ",
            "role.required" => "กรุณาเลือกบทบาท",
            "name.min" => "ชื่อต้องมีความยาวอย่างน้อย :min ตัวอักษร",
            "email.required" => "กรุณากรอกอีเมล",
            "email.email" => "กรุณากรอกอีเมลให้ถูกต้อง",
            "email.unique" => "อีเมลนี้ถูกใช้ไปแล้ว",
            "username.required" => "กรุณากรอกชื่อผู้ใช้",
            "username.min" => "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
            "username.unique" => "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว",
            'password.required' => 'กรุณากรอกรหัสผ่าน',
            'password.min' => 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            'password.confirmed' => 'รหัสผ่านไม่ตรงกัน',
            'password_confirmation.required' => 'กรุณายืนยันรหัสผ่าน',
            'password_confirmation.min' => 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
        ];
        $request->validate($rules, $message);

        $user = new User();
        $user->name = $request->name;
        $user->role = $request->role;
        $user->assignRole($request->role);
        $user->email = $request->email;
        $user->username = $request->username;
        $user->password = bcrypt($request->password);
        $user->save();

        return redirect()->route("admin.users.index")->withSuccess("บันทึกข้อมูลเรียบร้อย");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find($id);
        return Inertia::render("Admin/users/Edit", compact("user"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rules = [
            "name" => "required|min:3",
            'role' => 'required|in:admin,manager,employee',
            "email" => "required|email",
            'username' => 'required|min:3',
        ];
        $message = [
            "name.required" => "กรุณากรอกชื่อ",
            "role.required" => "กรุณาเลือกบทบาท",
            "name.min" => "ชื่อต้องมีความยาวอย่างน้อย :min ตัวอักษร",
            "email.required" => "กรุณากรอกอีเมล",
            "email.email" => "กรุณากรอกอีเมลให้ถูกต้อง",
            "username.required" => "กรุณากรอกชื่อผู้ใช้",
            "username.min" => "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
        ];

        if ($request->password != null) {
            $rules['password'] = 'required|confirmed';
            $message['password.required'] = 'กรุณากรอกรหัสผ่าน';
            $message['password.confirmed'] = 'รหัสผ่านไม่ตรงกัน';
        }

        $request->validate($rules, $message);

        $user = User::find($id);
        $user->assignRole($request->role);
        $user->name = $request->name;
        $user->role = $request->role;
        $user->email = $request->email;
        $user->username = $request->username;
        if ($request->password != null) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        return redirect()->route("admin.users.index")->with("success", value: "บันทึกข้อมูลเรียบร้อย");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        $user->delete();
        return redirect()->route("admin.users.index")->with("success", value: "ลบข้อมูลเรียบร้อย");
    }
}
