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
use App\Interfaces\ApplicantTypeInterface;
use App\Repositories\ApplicantTypeRepository;
use App\Interfaces\BusinessStatusInterface;
use App\Repositories\BusinessStatusRepository;
use App\Interfaces\BusinessNatureInterface;
use App\Repositories\BusinessNatureRepository;
use App\Interfaces\CapitalizationInterface;
use App\Repositories\CapitalizationRepository;


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
        $this->app->bind(ApplicantTypeInterface::class, ApplicantTypeRepository::class);
        $this->app->bind(BusinessStatusInterface::class, BusinessStatusRepository::class);
        $this->app->bind(BusinessNatureInterface::class, BusinessNatureRepository::class);
        $this->app->bind(CapitalizationInterface::class, CapitalizationRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
