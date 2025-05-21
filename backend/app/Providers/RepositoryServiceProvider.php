<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\ProponentRepository;
use App\Interfaces\ProponentRepositoryInterface;
use App\Interfaces\ZoningInterface;
use App\Repositories\ZoningRepository;
use App\Interfaces\BusinessTypeInterface;
use App\Repositories\BusinessTypeRepository;
use App\Interfaces\ApplicationTypeInterface;
use App\Repositories\ApplicationTypeRepository;
use App\Interfaces\AuthInterface;
use App\Repositories\UserRepository;


class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ProponentRepositoryInterface::class, ProponentRepository::class);
        $this->app->bind(ZoningInterface::class, ZoningRepository::class);
        $this->app->bind(BusinessTypeInterface::class, BusinessTypeRepository::class);
        $this->app->bind(ApplicationTypeInterface::class, ApplicationTypeRepository::class);
        $this->app->bind(AuthInterface::class, UserRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
