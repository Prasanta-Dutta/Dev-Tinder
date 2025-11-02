# Dev-Tinder APIs

## AuthRouter
- POST /auth/signup
- POST /auth/signin
- POST /auth/logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/change/password

## RequestRouter
- GET /request/send/:UserId        - view all request send by user
- GET /request/received/:UserId    - view all request come to user

## RequestStatusRouter
- POST /request/send/:status/:toUserId      - ignored, interested
- POST /request/review/:status/:toUserId    - accepted, rejected, blocked
