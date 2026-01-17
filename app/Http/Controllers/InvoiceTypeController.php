<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceTypeRequest;
use App\Http\Requests\UpdateInvoiceTypeRequest;
use App\Http\Resources\InvoiceTypeResource;
use App\Models\InvoiceType;
use App\Services\InvoiceTypeService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class InvoiceTypeController extends Controller
{
    protected InvoiceTypeService $invoiceTypeService;

    public function __construct(InvoiceTypeService $invoiceTypeService)
    {
        $this->invoiceTypeService = $invoiceTypeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['description', 'code']);

        $invoiceTypes = $this->invoiceTypeService->paginate($perPage, $filters);

        return inertia('invoice-types/index', [
            'invoiceTypes' => InvoiceTypeResource::collection($invoiceTypes),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        return inertia('invoice-types/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceTypeRequest $request): RedirectResponse
    {
        try {
            $invoiceType = $this->invoiceTypeService->create($request->validated());
            return redirect()->route('invoice-types.index')->with('success', "Invoice Type With ID " . $invoiceType->getAttribute('id') . " created successfully.");
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create invoice type: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InvoiceType $invoiceType): Response|ResponseFactory
    {
        return inertia('invoice-types/edit', [
            'invoiceType' => (new InvoiceTypeResource($invoiceType))->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceTypeRequest $request, InvoiceType $invoiceType): RedirectResponse
    {
        try {
            $updatedInvoiceType = $this->invoiceTypeService->update($invoiceType->getAttribute("id"), $request->validated());
            return redirect()->route('invoice-types.index')->with('success', 'Invoice Type updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to update invoice type: ' . $e->getMessage());
        }
    }
}
