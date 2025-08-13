@echo off
echo.
echo [CODE QUALITY CHECK] Running Prettier and ESLint checks...
echo.

echo [1/2] Checking code formatting with Prettier...
call npm run format:check
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Prettier formatting check failed!
    echo [TIP] Run 'npm run format' to fix formatting issues
    echo.
    goto :error
)
echo [SUCCESS] Prettier formatting check passed!
echo.

echo [2/2] Checking code quality with ESLint...
call npm run lint:check
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] ESLint code quality check failed!
    echo [TIP] Run 'npm run lint' to fix auto-fixable issues
    echo.
    goto :error
)
echo [SUCCESS] ESLint code quality check passed!
echo.

echo [SUCCESS] All code quality checks passed! Ready to start the application.
echo.
exit /b 0

:error
echo.
echo [FAILED] Code quality checks failed! Please fix the issues before starting the application.
echo [TIP] Run 'npm run code:fix' to automatically fix most issues.
echo.
exit /b 1
