<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ReceiptController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Receipt store request:', $request->all());

            if (!$request->has('svgData') || !$request->has('orderId')) {
                Log::error('Missing required data');
                return response()->json([
                    'success' => false,
                    'message' => 'Missing required data'
                ], 400);
            }

            $imageData = $request->input('svgData');
            $orderId = $request->input('orderId');
            
            Log::info('Processing order ID: ' . $orderId);
            
            $imageData = str_replace('data:image/png;base64,', '', $imageData);
            $imageData = str_replace(' ', '+', $imageData);
            $imageData = base64_decode($imageData);

            if (!$imageData) {
                Log::error('Invalid image data');
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid image data'
                ], 400);
            }

            $filename = 'receipt_' . date('Ymd_His') . '_' . Str::random(8) . '.png';

            if (!is_dir(public_path('images/receipt'))) {
                mkdir(public_path('images/receipt'), 0777, true);
            }

            file_put_contents(public_path('images/receipt/' . $filename), $imageData);
            
            // อัพเดท receipt_path ในตาราง orders
            $order = Order::findOrFail($orderId);
            Log::info('Found order:', $order->toArray());
            
            $order->receipt_path = $filename;
            $order->save();
            
            Log::info('Receipt saved successfully with filename: ' . $filename);

            return response()->json([
                'success' => true,
                'message' => 'Receipt saved successfully',
                'url' => asset('images/receipt/' . $filename),
                'filename' => $filename,
                'receipt_path' => $filename
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to save receipt: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to save receipt: ' . $e->getMessage()
            ], 500);
        }
    }
}
