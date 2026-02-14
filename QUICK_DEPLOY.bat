@echo off
echo ========================================
echo  Sephar Studios Smart Contract Deploy
echo ========================================
echo.

cd packages\contracts

echo [1/3] Installing dependencies...
call bun install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/3] Compiling contracts...
call bun run compile
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile contracts
    pause
    exit /b 1
)
echo.

echo [3/3] Deploying to Amoy testnet...
echo This will take 5-10 minutes...
call bun run deploy:amoy
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo IMPORTANT: Copy the contract addresses above
echo and add them to the root .env file:
echo.
echo PUBLIC_STC_TOKEN_AMOY=0x...
echo PUBLIC_SUBSCRIPTION_NFT_AMOY=0x...
echo PUBLIC_CREATOR_PAYMENTS_AMOY=0x...
echo PUBLIC_TOKEN_AMM_AMOY=0x...
echo.
pause
