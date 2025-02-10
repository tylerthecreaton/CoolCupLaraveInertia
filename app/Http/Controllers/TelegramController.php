<?php

namespace App\Http\Controllers;

use App\Console\Commands\StartCommand;
use Telegram\Bot\Laravel\Facades\Telegram;
use Illuminate\Http\Request;

class TelegramController extends Controller
{
    public function handle(Request $request)
    {
        // Register commands
        Telegram::addCommands([
            StartCommand::class
        ]);

        // Handle the incoming update
        $update = Telegram::commandsHandler(true);

        return response()->json(['status' => 'ok']);
    }

    public function sendMessage(String $message)
    {
        Telegram::sendMessage([
            'chat_id' => '7386484222',
            'text' => $message
        ]);
        return response()->json(['status' => 'ok']);
    }
}
