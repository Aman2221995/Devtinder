# DevTinder APIs:

## authRouter
-POST /signup
-POST /login
-POST /logout

## profileRouter
-GET  /profile/view(viewing the profile)
-PATCH /profile/edit(editing the profile)
-PATCH /profile/password

## ConnectionRequestRouter
-POST /request/send/:status/:userId
-POST /request/review/:status/:requestId

## userRouter
-GET /user/connections
-GET /user/requests/received
-GET /feed -Gets you the profiles of other users platform


Status: ignore, interested, accepeted, rejected