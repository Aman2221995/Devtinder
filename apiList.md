# DevTinder APIs:

## authRouter

-POST /signup
-POST /login
-POST /logout

## profileRouter

-GET /profile/view(viewing the profile)
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

## Pagination

-/feed?page=1&limit=10 =>1-10 {.skip(0) & .limit(10)}
-/feed?page=2&limit=10 =>11-20 {.skip(10) & .limit(10)}
-/feed?page=3&limit=10 =>21-30 {.skip(20) & .limit(10)}

## MongoDb function

-.skip(0) & .limit(10)

formula:
skip = (page-1)*limit;
