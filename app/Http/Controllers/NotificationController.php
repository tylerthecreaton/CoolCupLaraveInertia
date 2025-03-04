<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\IngredientLot;
use App\Models\Setting;
use App\Models\Consumable;
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
        $notifications = $this->getAllNotifications();

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
        $notifications = $this->getAllNotifications();
        return response()->json($notifications);
    }

    private function getAllNotifications(): array
    {
        $notifications = [
            ...$this->getIngredientsNotifications()['data'],
            ...$this->getConsumablesNotifications()['data']
        ];

        // Sort notifications by id to maintain consistent order
        usort($notifications, fn($a, $b) => $a->id - $b->id);

        return [
            'data' => $notifications,
            'total' => count($notifications)
        ];
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

    private function getConsumablesNotifications(): array
    {
        $notifications = [
            ...$this->createLessStockConsumablesNotifications()
        ];

        return [
            'data' => $notifications,
            'total' => count($notifications)
        ];
    }

    private function createLessStockConsumablesNotifications(): array
    {
        $consumables = $this->getLessStockConsumables();
        $notifications = [];
        $minimumStock = $this->setting->where('key', 'minimum_consumable_stock_alert')->first()?->value ?? 100;

        foreach ($consumables as $index => $consumable) {
            $notifications[] = new Notification(
                type: "low_stock_consumable",
                title: 'แจ้งเตือนวัตถุดิบสิ้นเปลืองใกล้หมด',
                message: "วัตถุดิบสิ้นเปลือง {$consumable->name} เหลือน้อยกว่าจำนวนขั้นต่ำ ({$consumable->quantity} {$consumable->unit?->abbreviation}) กรุณาเบิกวัตถุดิบที่หน้าเบิกวัตถุดิบสิ้นเปลือง",
                data: array_merge($consumable->toArray(), [
                    'minimum_stock' => $minimumStock,
                    'current_stock' => $consumable->quantity,
                    'unit' => $consumable->unit?->abbreviation
                ]),
                url: route('admin.consumables.index'),
                color: 'warning',
                id: $this->generateNotificationId('low_stock_consumable', $index)
            );
        }

        return $notifications;
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
                id: $this->generateNotificationId('low_stock', $index)
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
                    id: $this->generateNotificationId($isExpired ? 'expired' : 'expiring', $index)
                );
            }
        }

        return $notifications;
    }

    private function getLessStockConsumables()
    {
        $minimumStock = $this->setting->where('key', 'minimum_consumable_stock_alert')->first()?->value ?? 100;
        return Consumable::with('unit')
            ->where('quantity', '<=', $minimumStock)
            ->orderBy('quantity', 'asc')
            ->get();
    }

    private function getLessStockIngredients()
    {
        $minimumStock = $this->setting->where('key', 'minimum_ingredient_stock_alert')->first()?->value ?? 1000;
        return Ingredient::with('unit')
            ->where('quantity', '<=', function ($query) use ($minimumStock) {
                $query->selectRaw('IF(lower_stock_alert = 0, ?, lower_stock_alert)', [$minimumStock]);
            })
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
            ->select('ingredient_lots.*', 'ingredient_lot_details.expiration_date')
            ->orderBy('ingredient_lot_details.expiration_date', 'asc')
            ->distinct('ingredient_lots.id')
            ->get();
    }

    private function generateNotificationId(string $type, int $index): int
    {
        // Generate unique IDs for different notification types
        // This helps prevent ID conflicts between different notification types
        $typeMultiplier = match ($type) {
            'low_stock' => 1000,
            'expired' => 2000,
            'expiring' => 3000,
            'low_stock_consumable' => 4000,
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
