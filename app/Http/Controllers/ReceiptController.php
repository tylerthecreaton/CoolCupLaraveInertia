<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ReceiptController extends Controller
{
    function store(Request $request)
    {
        try {
            if (!$request->has('svgData')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No image data provided'
                ], 400);
            }

            $imageData = $request->input('svgData');
            $imageData = str_replace('data:image/png;base64,', '', $imageData);
            $imageData = str_replace(' ', '+', $imageData);
            $imageData = base64_decode($imageData);

            if (!$imageData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid image data'
                ], 400);
            }

            $filename = 'receipt-' . time() . '.png';

            if (!is_dir(public_path('images/receipt'))) {
                mkdir(public_path('images/receipt'), 0777, true);
            }

            file_put_contents(public_path('images/receipt/' . $filename), $imageData);
            $url = asset('images/receipt/' . $filename);

            return response()->json([
                'success' => true,
                'message' => 'Receipt saved successfully',
                'url' => $url,
                'filename' => $filename
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save receipt: ' . $e->getMessage()
            ], 500);
        }
    }
}
