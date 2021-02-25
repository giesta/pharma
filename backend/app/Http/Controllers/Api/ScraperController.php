<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Services\ScraperService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class ScraperController extends Controller
{
    /**
     * Get all the items openings at a specified url
     */
    public function index(ScraperService $scraperService)
    {
        $url = 'https://www.ligos.lt/lt/simptomai/';
        
        $data = $scraperService->scrap($url);
        return response()->json([
            'success' => true,
            'data' => $data,
        ], Response::HTTP_OK);
    }
}
