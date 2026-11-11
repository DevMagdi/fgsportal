<?php

$finder = PhpCsFixer\Finder::create()
    ->in([
        __DIR__.'/app/Http/Controllers/BMS',
        __DIR__.'/app/Models/BMS',
        __DIR__.'/app/Services/BMS',
        __DIR__.'/app/Console/Commands',
        __DIR__.'/tests',
    ])
    ->name('*.php');

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(false)
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'single_quote' => true,
        'trailing_comma_in_multiline' => true,
    ])
    ->setFinder($finder);
