<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\IngredientLot;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use JsonSerializable;

class NotificationController extends Controller
{
    public function __construct(
        private readonly Setting $setting
    ) {}

    public function index()
    {
        $notifications = $this->getIngredientsNotifications();

        return Inertia::render('Notifications/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'notifications' => $notifications['data'],
            'total' => $notifications['total']
        ]);
    }

    public function markAsRead($id)
    {
        // Implementation for marking notification as read
        // This could be stored in a notifications table
        return redirect()->back();
    }

    public function markAllAsRead()
    {
        // Implementation for marking all notifications as read
        return redirect()->back();
    }

    public function getNotifications()
    {
        $notifications = $this->getIngredientsNotifications();
        return response()->json($notifications);
    }

    private function getIngredientsNotifications(): array
    {
        $notifications = [
            ...$this->createLessStockNotifications(),
            ...$this->createExpiringLotNotifications()
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
        $minimumStock = $this->setting->where('key', 'minimum_ingredient_stock_alert')->first()?->value ?? 1000;

        foreach ($ingredients as $index => $ingredient) {
            $notifications[] = new Notification(
                type: "low_stock",
                title: 'แจ้งเตือนวัตถุดิบใกล้หมด',
                message: "วัตถุดิบ {$ingredient->name} เหลือน้อยกว่าจำนวนขั้นต่ำ ({$ingredient->quantity} {$ingredient->unit?->abbreviation}) กรุณาเบิกวัตถุดิบที่หน้าเบิกวัตถุดิบ",
                data: array_merge($ingredient->toArray(), [
                    'minimum_stock' => $minimumStock,
                    'current_stock' => $ingredient->quantity,
                    'unit' => $ingredient->unit?->abbreviation
                ]),
                url: route('admin.withdraw.create'),
                color: 'warning',
                id: $index + 1
            );
        }

        return $notifications;
    }

    private function createExpiringLotNotifications(): array
    {
        $expiringIngredients = $this->getExpiringIngredients();
        $notifications = [];
        $warningDays = $this->setting->where('key', 'expiration_warning_days')->first()?->value ?? 30;

        foreach ($expiringIngredients as $index => $ingredientLot) {
            foreach ($ingredientLot->details as $detail) {
                $daysUntilExpiration = Carbon::now()->diffInDays(Carbon::parse($detail->expiration_date), false);
                $isExpired = $daysUntilExpiration <= 0;

                $notifications[] = new Notification(
                    type: $isExpired ? "expired" : "expiring",
                    title: $isExpired ? 'แจ้งเตือนวัตถุดิบหมดอายุ' : 'แจ้งเตือนวัตถุดิบใกล้หมดอายุ',
                    message: $isExpired
                        ? "วัตถุดิบ {$detail->ingredient->name} หมดอายุแล้ว กรุณาจำหน่ายออกจากระบบ"
                        : "วัตถุดิบ {$detail->ingredient->name} จะหมดอายุในอีก {$daysUntilExpiration} วัน",
                    data: array_merge($detail->toArray(), [
                        'is_expired' => $isExpired,
                        'days_until_expiration' => $daysUntilExpiration,
                        'ingredient_name' => $detail->ingredient->name,
                        'unit' => $detail->ingredient->unit?->abbreviation
                    ]),
                    url: $isExpired
                        ? route('admin.ingredient-lots.expired.index', $detail->ingredient_id)
                        : route('admin.ingredient-lots.create', ['ingredient_id' => $detail->ingredient_id]),
                    color: $isExpired ? 'error' : 'danger',
                    id: count($notifications) + $index + 1
                );
            }
        }

        return $notifications;
    }

    private function getLessStockIngredients()
    {
        $minimumStock = $this->setting->where('key', 'minimum_ingredient_stock_alert')->first()?->value ?? 1000;
        return Ingredient::with('unit')
            ->where('quantity', '<=', $minimumStock)
            ->orderBy('quantity', 'asc')
            ->get();
    }

    private function getExpiringIngredients()
    {
        $expiringDays = (int) ($this->setting->where('key', 'ingredient_expired_before_date')->first()?->value ?? 7);
        $expiryDate = now()->addDays($expiringDays);

        return IngredientLot::with(['details.ingredient.unit'])
            ->join('ingredient_lot_details', 'ingredient_lots.id', '=', 'ingredient_lot_details.ingredient_lot_id')
            ->where('ingredient_lot_details.expiration_date', '<=', $expiryDate)
            ->orderBy('ingredient_lot_details.expiration_date', 'asc')
            ->select('ingredient_lots.*')
            ->distinct()
            ->get();
    }

    private function generateNotificationId(string $type, int $index): int
    {
        // Generate unique IDs for different notification types
        // This helps prevent ID conflicts between different notification types
        $typeMultiplier = match ($type) {
            'low_stock' => 1000,
            'expired' => 2000,
            'expiring_soon' => 3000,
            default => 0
        };

        return $typeMultiplier + $index + 1;
    }
}

class Notification implements JsonSerializable
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

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'data' => $this->data,
            'url' => $this->url,
            'color' => $this->color,
        ];
    }
}
