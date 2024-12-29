<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private readonly Setting $setting
    ) {}

    public function index()
    {
        $notifications = $this->getIngredientsNotifications();

        return [
            'notifications' => $notifications
        ];
    }

    private function getIngredientsNotifications(): array
    {
        $notifications = [
            ...$this->createLessStockNotifications(),
            ...$this->createExpiredNotifications()
        ];

        // Sort notifications by id to maintain consistent order
        usort($notifications, fn($a, $b) => $a->id - $b->id);

        return [
            'data' => $notifications,
            'total' => count($notifications)
        ];
    }

    private function createLessStockNotifications(): array
    {
        $ingredients = $this->getLessStockIngredients();
        $notifications = [];

        foreach ($ingredients as $index => $ingredient) {
            $notifications[] = new Notification(
                type: "low_stock",
                title: 'แจ้งเตือนวัตถุดิบใกล้หมด',
                message: "วัตถุดิบ {$ingredient->name} เหลือน้อยกว่าจำนวนขั้นต่ำ ({$ingredient->quantity} {$ingredient->unit})",
                data: $ingredient->toArray(),
                url: "/ingredients/{$ingredient->id}",
                color: 'warning',
                id: $this->generateNotificationId('low_stock', $index)
            );
        }

        return $notifications;
    }

    private function createExpiredNotifications(): array
    {
        $ingredients = $this->getExpiredIngredients();
        $notifications = [];

        foreach ($ingredients as $index => $ingredient) {
            $expirationDate = Carbon::parse($ingredient->expiration_date)->format('d/m/Y');

            $notifications[] = new Notification(
                type: "expired",
                title: 'แจ้งเตือนวัตถุดิบหมดอายุ',
                message: "วัตถุดิบ {$ingredient->name} หมดอายุวันที่ {$expirationDate}",
                data: $ingredient->toArray(),
                url: "/ingredients/{$ingredient->id}",
                color: 'danger',
                id: $this->generateNotificationId('expired', $index)
            );
        }

        return $notifications;
    }

    private function getLessStockIngredients()
    {
        $minimumStock = $this->setting->where('key', 'minimum_ingredient_stock_alert')->first()->value ?? 1000;
        return Ingredient::where('quantity', '<', $minimumStock)->get();
    }

    private function getExpiredIngredients()
    {
        $expiringDays = (int) ($this->setting->where('key', 'ingredient_expired_before_date')->first()->value ?? 7);
        $expiryDate = now()->addDays($expiringDays);

        return Ingredient::where('expiration_date', '<=', $expiryDate)
            ->orderBy('expiration_date')
            ->get();
    }

    private function generateNotificationId(string $type, int $index): int
    {
        // Generate unique IDs for different notification types
        // This helps prevent ID conflicts between different notification types
        $typeMultiplier = match ($type) {
            'low_stock' => 1000,
            'expired' => 2000,
            default => 0
        };

        return $typeMultiplier + $index + 1;
    }
}

class Notification
{
    public function __construct(
        public string $type,
        public string $title,
        public string $message,
        public array $data,
        public string $url,
        public string $color,
        public int $id
    ) {}
}
