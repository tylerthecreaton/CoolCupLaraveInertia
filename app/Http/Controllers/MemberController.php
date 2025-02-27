<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class MemberController extends Controller
{
    public function index()
    {
        if (request()->has('id')) {
            $customer = Customer::with([
                'orders.orderDetails',
                'pointUsages'
            ])->findOrFail(request()->id);

            // Get date filters
            $startDate = request()->get('startDate');
            $endDate = request()->get('endDate');
            $pointStartDate = request()->get('pointStartDate');
            $pointEndDate = request()->get('pointEndDate');

            // Determine which pagination to apply based on type
            $type = request()->get('type', 'orders');

            // Use different page parameters for each type
            $ordersPage = $type === 'orders' ? request()->get('orders_page', 1) : 1;
            $pointUsagesPage = $type === 'point_usages' ? request()->get('point_usages_page', 1) : 1;

            // Query for orders with date filter
            $ordersQuery = $customer->orders()->with('orderDetails')->latest();
            if ($startDate && $endDate) {
                $ordersQuery->whereBetween('created_at', [$startDate, $endDate]);
            }
            $orders = $ordersQuery->paginate(10, ['*'], 'orders_page', $ordersPage);

            // Query for point usages with date filter
            $pointUsagesQuery = $customer->pointUsages()->latest();
            if ($pointStartDate && $pointEndDate) {
                $pointUsagesQuery->whereBetween('created_at', [$pointStartDate, $pointEndDate]);
            }
            $pointUsages = $pointUsagesQuery->paginate(10, ['*'], 'point_usages_page', $pointUsagesPage);

            return Inertia::render('Member', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'phone_number' => $customer->phone_number,
                    'birthdate' => $customer->birthdate,
                    'loyalty_points' => $customer->loyalty_points,
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at,
                    'orders' => [
                        'data' => $orders->map(function ($order) {
                            return [
                                'id' => $order->id,
                                'total' => $order->orderDetails->sum('subtotal'),
                                'status' => $order->status,
                                'created_at' => $order->created_at,
                                'receipt_path' => $order->receipt_path,
                                'invoice_number' => $order->invoice_number,
                                'items' => $order->orderDetails->map(function ($detail) {
                                    return [
                                        'product_name' => $detail->product_name,
                                        'quantity' => $detail->quantity,
                                        'price' => $detail->price,
                                        'subtotal' => $detail->subtotal
                                    ];
                                })
                            ];
                        }),
                        'current_page' => $orders->currentPage(),
                        'per_page' => $orders->perPage(),
                        'total' => $orders->total()
                    ],
                    'point_usages' => [
                        'data' => $pointUsages->map(function ($usage) {
                            $description = $usage->type === 'plus'
                                ? 'รับคะแนนจากการสั่งซื้อ #' . $usage->order_id
                                : 'ใช้คะแนนส่วนลด #' . $usage->order_id;

                            return [
                                'id' => $usage->id,
                                'points' => $usage->type === 'plus' ? $usage->point_amount : $usage->point_discount_amount,
                                'type' => $usage->type,
                                'description' => $description,
                                'created_at' => $usage->created_at
                            ];
                        }),
                        'current_page' => $pointUsages->currentPage(),
                        'per_page' => $pointUsages->perPage(),
                        'total' => $pointUsages->total()
                    ]
                ]
            ]);
        }

        return Inertia::render('Member');
    }

    public function search(Request $request)
    {
        if ($request->has('query')) {
            $query = $request->query('query');
            $customers = Customer::where('name', 'LIKE', "%{$query}%")
                ->orWhere('phone_number', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get()
                ->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'phone_number' => $customer->phone_number,
                        'birthdate' => $customer->birthdate ? Carbon::parse($customer->birthdate)->format('Y-m-d') : null,
                        'created_at' => $customer->created_at ? Carbon::parse($customer->created_at)->format('Y-m-d') : null,
                        'points' => $customer->loyalty_points ?? 0,
                        'status' => $customer->status ?? 'active'
                    ];
                });

            return response()->json(['suggestions' => $customers]);
        }

        return response()->json(['suggestions' => []]);
    }

    public function register()
    {
        return Inertia::render('RegisterMember');
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|alpha|max:255|min:3',
            'phone_number' => 'required|string|size:10',
            'birthdate' => 'required|date',
        ];

        $messages = [
            'name.required' => 'กรุณากรอกชื่อ',
            'name.alpha' => 'ชื่อต้องเป็นตัวอักษรเท่านั้น',
            'name.max' => 'ชื่อต้องมีความยาวอย่างน้อย 255 ตัวอักษร',
            'name.min' => 'ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
            'phone_number.required' => 'กรุณากรอกหมายเลขโทรศัพท์',
            'phone_number.size' => 'หมายเลขโทรศัพท์ต้องมี 10 ตัว',
            'birthdate.required' => 'กรุณากรอกวันเกิด',
            'birthdate.date' => 'กรุณากรอกวันเกิดให้ถูกต้อง',
        ];

        $request->validate($rules, $messages);

        $data = $request->all();
        $data['birthdate'] = Carbon::parse($request->birthdate)->format('Y-m-d');

        $customer = Customer::create($data);
        return redirect()->route('member.index', ['id' => $customer->id])->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function edit($id)
    {
        $customer = Customer::findOrFail($id);
        return Inertia::render('EditMember', ['customer' => $customer]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|size:10',
            'birthdate' => 'required|date',
        ]);

        $customer = Customer::findOrFail($id);

        $customer->update($request->all());
        return redirect()->route('member.index')->with('success', 'บันทึกข้อมูลเรียบร้อย');
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        return redirect()->route('member.index')->with('success', 'ลบข้อมูลเรียบร้อย');
    }


    public function checkPhoneNumber(Request $request)
    {
        $exists = Customer::where('phone_number', $request->phone_number)->exists();
        return response()->json(['exists' => $exists]);
    }
}
