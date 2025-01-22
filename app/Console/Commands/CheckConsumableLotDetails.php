<?php

namespace App\Console\Commands;

use App\Models\ConsumableLot;
use App\Models\ConsumableLotDetail;
use Illuminate\Console\Command;

class CheckConsumableLotDetails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:lot-details';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check latest ConsumableLotDetail records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $details = ConsumableLotDetail::with(['consumableLot', 'consumable'])
            ->latest()
            ->take(5)
            ->get();

        if ($details->isEmpty()) {
            $this->info('No ConsumableLotDetail records found.');
            return;
        }

        foreach ($details as $detail) {
            $this->info("----------------------------------------");
            $this->info("Detail ID: " . $detail->id);
            $this->info("Lot Number: " . $detail->consumableLot->lot_number);
            $this->info("Consumable: " . $detail->consumable->name);
            $this->info("Quantity: " . $detail->quantity);
            $this->info("Price: " . $detail->price);
            $this->info("Type: " . $detail->type);
            $this->info("Supplier: " . $detail->supplier);
            $this->info("Created at: " . $detail->created_at);
        }
    }
}
