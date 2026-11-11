<?php

namespace App\Services\BMS;

final class SafeFilename
{
    public static function forDownload(?string $name, string $fallback = 'download'): string
    {
        $name = basename(str_replace('\\', '/', (string) $name));
        $name = preg_replace('/[\x00-\x1F\x7F]+/', '', $name) ?: '';
        $name = trim(str_replace(['"', ';'], '_', $name));

        return $name !== '' && $name !== '.' && $name !== '..' ? $name : $fallback;
    }
}
