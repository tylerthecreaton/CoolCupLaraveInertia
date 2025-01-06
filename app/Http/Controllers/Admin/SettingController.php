<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'types' => Setting::TYPES
        ]);
    }

    public function settings()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }

    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|in:general,email,payment,system,other',
            'comment' => 'nullable|string'
        ]);

        Setting::create($request->all());

        return redirect()->back()->with('success', 'Setting created successfully');
    }

    public function update(Request $request, Setting $setting)
    {
        $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|in:general,email,payment,system,other',
            'comment' => 'nullable|string'
        ]);

        $setting->update($request->all());

        return redirect()->back()->with('success', 'Setting updated successfully');
    }

    public function destroy(Setting $setting)
    {
        if ($setting->type === 'system') {
            return redirect()->back()->with('error', 'System settings cannot be deleted');
        }

        $setting->delete();
        return redirect()->back()->with('success', 'Setting deleted successfully');
    }
}
