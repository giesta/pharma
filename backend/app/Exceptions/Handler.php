<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof MethodNotAllowedHttpException) {
            return response()->json([
                'status' => 'error',
                'message' => "Method Not Allowed"
            ], JsonResponse::HTTP_METHOD_NOT_ALLOWED);
        }
        if ($exception instanceof NotFoundHttpException) {
            return response()->json([
                'status' => 'error',
                'message' => "Not Found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'status' => 'error',
                'message' => "No Results"
            ], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($exception instanceof ValidationException) {
            return response()->json([
                'status' => 'error',
                'message' => [
                    'errors' => $exception->getMessage(),
                    'fields' => $exception->validator->getMessageBag()->toArray()
                ]
            ], JsonResponse::HTTP_PRECONDITION_FAILED);
        }

        if ($exception instanceof UnauthorizedHttpException) {
            $previous_exception = $exception->getPrevious();
            switch ($previous_exception) {
                case $previous_exception instanceof TokenExpiredException:
                case $previous_exception instanceof TokenInvalidException:
                case $previous_exception instanceof TokenBlacklistedException:
                    return response()->json([
                        'status' => 'error',
                        'message' => "{$exception->getMessage()}"
                    ], JsonResponse::HTTP_UNAUTHORIZED);
                    break;
                default:
                    return response()->json([
                        'status' => 'error',
                        'message' => "{$exception->getMessage()}"
                    ], JsonResponse::HTTP_UNAUTHORIZED);
                    break;
            }
        }

        return parent::render($request, $exception);
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Illuminate\Http\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        
            return response()->json(['error' => 'Unauthenticated.'], 401);
        
    }
}
