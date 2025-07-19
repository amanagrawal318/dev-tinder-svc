# DevTinder APIs

## AuthRouter

- POST /auth/signup
- POST /auth/login
- POST /auth/logout
- POST /auth/forgot-password - sent OTP to email
- POST /auth/update-password - verify OTP and update password

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/:status/:toUserId
- POST /request/review/:status/:requestId

## UserRoutes

- GET /user/connections
- GET /user/requests/received
- GET /user/feed?page=1&limit=10
