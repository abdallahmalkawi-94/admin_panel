<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);

        $filters = $request->only(['name', 'email', 'phone', 'status_id', 'country_code']);

        $users = $this->userService->paginate($perPage, $filters);
        $statuses = $this->userService->getAllStatuses();
        $countries = $this->userService->getDistinctCountries();

        return inertia('users/index', [
            'users' => UserResource::collection($users),
            'filters' => $filters,
            'statuses' => $statuses,
            'countries' => $countries,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
