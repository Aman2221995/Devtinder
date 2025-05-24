# DevTinder APIs:

authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET  /profile/view(viewing the profile)
-PATCH /profile/edit(editing the profile)
-PATCH /profile/password

ConnectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

userRouter
-GET /user/connections
-GET /user/requests/received
-GET /feed -Gets you the profiles of other users platform


Status: ignore, interested, accepeted, rejected