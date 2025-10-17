<?php

namespace App\Http\Controllers;

use App\Http\Resources\LanguageResource;
use App\Models\Language;
use App\Services\LanguageService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class LanguageController extends Controller
{
    protected LanguageService $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);

        $filters = $request->only(['name', 'code', 'dir']);

        $languages = $this->languageService->paginate($perPage, $filters);

        return inertia('languages/index', [
            'languages' => LanguageResource::collection($languages),
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Language $language): Response|ResponseFactory
    {
        return inertia('languages/show', [
            'language' => (new LanguageResource($language))->resolve(),
        ]);
    }
}

