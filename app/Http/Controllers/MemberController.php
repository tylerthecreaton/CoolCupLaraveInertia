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
                'orders' => function ($query) {
                    $query->latest()->limit(10);
                },
                'orders.orderDetails',
                'pointUsages' => function ($query) {
                    $query->latest()->limit(10);
                }
            ])->findOrFail(request()->id);

            return Inertia::render('Member', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'phone_number' => $customer->phone_number,
                    'birthdate' => $customer->birthdate,
                    'loyalty_points' => $customer->loyalty_points,
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at,
                    'orders' => $customer->orders->map(function ($order) {
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
                    'point_usages' => $customer->pointUsages->map(function ($usage) {
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
                    })
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
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|size:10',
            'birthdate' => 'required|date',
        ]);

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
