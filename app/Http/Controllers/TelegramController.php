<?php

namespace App\Http\Controllers;

use App\Models\TelegramUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Telegram\Bot\Api;

class TelegramController extends Controller
{
    protected $telegram;

    /**
     * Create a new controller instance.
     *
     * @param  Api  $telegram
     */
    public function __construct(Api $telegram)
    {
        $this->telegram = $telegram;
    }

    public function handleWebhook(Request $request)
    {
        $data = $request->all();
        if (!isset($data['message'])) {
            return response()->json(['status' => 'error', 'message' => 'Not a message']);
        }

        $message = $data['message'];
        $chat_id = $message['chat']['id'];
        $text = $message['text'] ?? '';

        if (Str::startsWith($text, '/start')) {
            return $this->handleStartCommand($chat_id, $text);
        }

        if (!$this->isUserRegistered($chat_id)) {
            return $this->sendRegistrationInstructions($chat_id);
        }

        // Handle other commands here

        return response()->json(['status' => 'success']);
    }

    private function handleStartCommand($chat_id, $text)
    {
        $parts = explode(' ', $text, 2);
        if (count($parts) !== 2) {
            return $this->sendRegistrationInstructions($chat_id);
        }

        $username = trim($parts[1]);
        $user = User::where('username', $username)->first();

        if (!$user) {
            return $this->sendTelegramMessage($chat_id, 'ไม่พบ username นี้ในระบบ กรุณาลองใหม่อีกครั้ง');
        }

        TelegramUser::updateOrCreate(
            ['user_id' => $user->id],
            ['chat_id' => $chat_id]
        );

        return $this->sendTelegramMessage($chat_id, "เชื่อมต่อบัญชีสำเร็จแล้ว ยินดีต้อนรับคุณ {$user->name}");
    }

    private function isUserRegistered($chat_id)
    {
        return TelegramUser::where('chat_id', $chat_id)->exists();
    }

    private function sendRegistrationInstructions($chat_id)
    {
        return $this->sendTelegramMessage($chat_id, 'กรุณาพิมพ์ /start ตามด้วย username เพื่อเชื่อมต่อบัญชี เช่น "/start johndoe"');
    }


    public function sendTelegramMessage($chat_id, $text, string $parse_mode = null)
    {
        $this->telegram->sendMessage([
            'chat_id' => $chat_id,
            'text' => $text,
            'parse_mode' => $parse_mode
        ]);
    }

    public function sendPaymentReminder(string $message)
    {
        // ดึง chat_id จากตาราง telegram_users
        $telegramUsers = TelegramUser::all();

        if ($telegramUsers->isEmpty()) {
            Log::error('ไม่พบผู้ใช้ Telegram ในระบบ');
            return;
        }

        foreach ($telegramUsers as $user) {
            if (!empty($user->chat_id)) {
                $this->sendTelegramMessage($user->chat_id, $message, 'Markdown');
            }
        }
    }
}
