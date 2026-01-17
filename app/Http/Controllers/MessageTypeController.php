<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageTypeResource;
use App\Models\MessageType;
use App\Services\MessageTypeService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class MessageTypeController extends Controller
{
    protected MessageTypeService $messageTypeService;

    public function __construct(MessageTypeService $messageTypeService)
    {
        $this->messageTypeService = $messageTypeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['description', 'code']);

        $messageTypes = $this->messageTypeService->paginate($perPage, $filters);

        return inertia('message-types/index', [
            'messageTypes' => MessageTypeResource::collection($messageTypes),
            'filters' => $filters,
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
    public function show(MessageType $messageType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MessageType $messageType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MessageType $messageType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MessageType $messageType)
    {
        //
    }
}
