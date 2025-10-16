# Dev-Tinder APIs

## AuthRouter
- POST /auth/signup
- POST /auth/signin
- POST /auth/logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgot

## RequestRouter
- GET /request/send/:UserId        - view all request send by user
- GET /request/received/:UserId    - view all request come to user

## RequestStatusRouter
- POST /request/status/pending
- POST /request/status/accepted
- POST /request/status/rejected
- POST /request/status/blocked