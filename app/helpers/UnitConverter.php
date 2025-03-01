<?php

namespace App\Helpers;

class UnitConverter
{
    // ตารางแปลงหน่วยพื้นฐานสำหรับการทำอาหาร
    private static $conversionTable = [
        'gram_to_teaspoon' => 0.2, // 5 กรัม = 1 ช้อนชา
        'gram_to_tablespoon' => 0.0667, // 15 กรัม = 1 ช้อนโต๊ะ
        'gram_to_cup' => 0.00423, // 1 กรัม = 0.00423 ถ้วย
        'ml_to_teaspoon' => 0.2, // 5 มิลลิลิตร = 1 ช้อนชา
        'ml_to_tablespoon' => 0.0667, // 15 มิลลิลิตร = 1 ช้อนโต๊ะ
        'ml_to_cup' => 0.00422675, // 1 มิลลิลิตร = 0.00422675 ถ้วย
    ];

    /**
     * แปลงจากกรัมเป็นช้อนชา
     */
    public static function gramToTeaspoon(float $grams): float
    {
        return $grams * self::$conversionTable['gram_to_teaspoon'];
    }

    /**
     * แปลงจากกรัมเป็นช้อนโต๊ะ
     */
    public static function gramToTablespoon(float $grams): float
    {
        return $grams * self::$conversionTable['gram_to_tablespoon'];
    }

    /**
     * แปลงจากกรัมเป็นถ้วย
     */
    public static function gramToCup(float $grams): float
    {
        return $grams * self::$conversionTable['gram_to_cup'];
    }

    /**
     * แปลงจากมิลลิลิตรเป็นช้อนชา
     */
    public static function mlToTeaspoon(float $ml): float
    {
        return $ml * self::$conversionTable['ml_to_teaspoon'];
    }

    /**
     * แปลงจากมิลลิลิตรเป็นช้อนโต๊ะ
     */
    public static function mlToTablespoon(float $ml): float
    {
        return $ml * self::$conversionTable['ml_to_tablespoon'];
    }

    /**
     * แปลงจากมิลลิลิตรเป็นถ้วย
     */
    public static function mlToCup(float $ml): float
    {
        return $ml * self::$conversionTable['ml_to_cup'];
    }

    /**
     * แปลงหน่วยแบบทั่วไป
     */
    public static function convert(float $value, string $from, string $to): ?float
    {
        $key = "{$from}_to_{$to}";
        return isset(self::$conversionTable[$key])
            ? $value * self::$conversionTable[$key]
            : null;
    }
}
