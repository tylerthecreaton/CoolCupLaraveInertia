<?php

namespace App\Helpers;

class UrlHelper
{
    static public function isAbsoluteUrl(string $url): bool
    {
        return preg_match('`^https?://`', $url) === 1;
    }
}
