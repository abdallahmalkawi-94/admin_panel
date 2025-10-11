<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Exception;
use Illuminate\Http\RedirectResponse;
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
        $countries = $this->userService->getDistinctCountries();

        return inertia('users/create', [
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        try {
            $this->userService->create($request->validated());
            return redirect()->route('users.index')->with('success', 'User created successfully. Login credentials and email verification link have been sent to their email.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response|ResponseFactory
    {
        $user->load(['status', 'country']);

        return inertia('users/show', [
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response|ResponseFactory
    {
        $user->load(['status', 'country']);
        $countries = $this->userService->getDistinctCountries();
        $statuses = $this->userService->getAllStatuses();

        return inertia('users/edit', [
            'user' => (new UserResource($user))->resolve(),
            'countries' => $countries,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        try {
            $this->userService->update($user->id, $request->validated());

            return redirect()->route('users.index')
                ->with('success', 'User updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        try {
            // Prevent deleting yourself
            if ($user->id === auth()->id()) {
                return back()->with('error', 'You cannot delete your own account.');
            }

            $this->userService->delete($user->id);

            return redirect()->route('users.index')
                ->with('success', 'User deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete user: ' . $e->getMessage());
        }
    }
}
