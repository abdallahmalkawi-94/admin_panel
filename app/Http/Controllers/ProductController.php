<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);

        $filters = $request->only(['name']);

        $products = $this->productService->paginate($perPage, $filters);

        return inertia('products/index', [
            'products' => ProductResource::collection($products),
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        try {
            $product = $this->productService->create($request->validated());
            return redirect()->route('products.index')->with('success', "Product With ID " . $product->getAttribute('id') . " created successfully.");
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('products/create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        return Inertia::render('products/show', [
            'product' => (new ProductResource($product))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => (new ProductResource($product))->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProductRequest $request, Product $product): RedirectResponse
    {
        try {
            $updatedProduct = $this->productService->update($product->getAttribute("id"), $request->validated());
            return redirect()->route('products.show', $updatedProduct->getAttribute("id"))->with('success', 'Product updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        try {
            $this->productService->delete($product->getAttribute("id"));
            return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }
}
