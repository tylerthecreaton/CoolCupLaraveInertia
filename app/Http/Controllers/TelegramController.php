<?php

namespace App\Http\Controllers;

use App\Models\TelegramUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TelegramController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $data = $request->all();
        
        // ตรวจสอบว่าเป็นข้อความหรือไม่
        if (!isset($data['message'])) {
            return response()->json(['status' => 'error', 'message' => 'Not a message']);
        }

        $message = $data['message'];
        $chat_id = $message['chat']['id'];
        $text = $message['text'] ?? '';
        
        // ตรวจสอบว่าเป็นคำสั่ง /start หรือไม่
        if (Str::startsWith($text, '/start')) {
            // แยกคำสั่งและ username
            $parts = explode(' ', $text, 2);
            
            // ถ้าไม่มี username ต่อท้าย
            if (count($parts) !== 2) {
                return $this->sendTelegramMessage($chat_id, 'กรุณาพิมพ์ /start ตามด้วย username เพื่อเชื่อมต่อบัญชี เช่น "/start johndoe"');
            }

            $username = trim($parts[1]); // ดึง username ส่วนที่สอง
            
            // ค้นหา user จาก username
            $user = User::where('username', $username)->first();
            
            if (!$user) {
                return $this->sendTelegramMessage($chat_id, 'ไม่พบ username นี้ในระบบ กรุณาลองใหม่อีกครั้ง');
            }

            // บันทึกหรืออัพเดท Telegram chat_id
            TelegramUser::updateOrCreate(
                ['user_id' => $user->id],
                ['chat_id' => $chat_id]
            );

            return $this->sendTelegramMessage($chat_id, "เชื่อมต่อบัญชีสำเร็จแล้ว ยินดีต้อนรับคุณ {$user->name}");
        }

        // ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้วหรือยัง
        $telegramUser = TelegramUser::where('chat_id', $chat_id)->first();
        if (!$telegramUser) {
            return $this->sendTelegramMessage($chat_id, 'กรุณาพิมพ์ /start ตามด้วย username เพื่อเชื่อมต่อบัญชี เช่น "/start johndoe"');
        }

        // ตรงนี้คุณสามารถเพิ่มโค้ดสำหรับจัดการคำสั่งอื่นๆ ได้

        return response()->json(['status' => 'success']);
    }

    private function sendTelegramMessage($chat_id, $text)
    {
        $botToken = config('services.telegram.bot_token');
        $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
        
        $data = [
            'chat_id' => $chat_id,
            'text' => $text,
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);

        return response()->json(['status' => 'success', 'message' => $text]);
    }
}
