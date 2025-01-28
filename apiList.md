
## authRouter
- POST /signup  -> completed
- POST /login   -> completed
- POST /logout  -> completed

## profileRouter
- GET /profile/view                                 -> completed
- PATCH /profile/edit                                -> completed 
- PATCH /profile/password // forgot password API

## connectionRequestRouter
 - POST /request/send/interested/:userId
 - POST /request/send/ignored/:userId
 - POST /request/review/accepted/:requestId
 - POST /request/review/rejected/:requestId

 ## userRouter
 - GET /users/connections
 - GET /users/requests
 - GET /users/feed - gets you the posts of users you are connected to

  Status: ignored, interested , accepted, rejected