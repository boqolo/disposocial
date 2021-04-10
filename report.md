## Final Project Written Report
### Rayyan Abdi

This final project was completed by a team composed of myself.
The app is deployed at https://disposocial.com and its source
code lives in my GitHub repo, which can be found at
https://github.com/boqolo/disposocial. 

The app is deployed and functioning with most of the features in
my initial proposal completed, though my priorities have
progressively changed during the project's course. The steps I 
have taken to accomplish my desired features include setting up 
the database and its relations, implementing user accounts with, 
password hashing, designing the UI, setting up the clientside 
Redux store, setting up React routing, implementing api paths, 
implementing all controllers, implementing Phoenix channels, 
implementing GenServers, implementing context modules, implementing 
file uploads, implementing geolocation and radius calculation, 
implementing browser local session storage, implementing api and 
channel sessions, purchasing and deploying the domain with HTTPS,
implement live posting, commenting, liking/disliking, using 
Phoenix Presence to show online users, and implementing 
self-destruction (this is a key feature of my app).

My app, Disposocial, is a location-based, decentralized, disposable
social media platform at its basis. It allows users to create 
and/or join "Dispos" (used hereafter for brevity), which are
spaces where users can make posts (with or without photos) and 
see updates live from all local users in the Dispo. Dispos can
be public or private (secured with a passphrase). All Dispos
have geographic coordinates which represent where they were 
created. Users can only join Dispos that have been created within
their geographic radius. Currently, the radius calculations allow
for discovery of Dispos within 5 miles of the users fetched 
latitude and longitude, however more options are planned. Available
Dispos to join appear in the user's Discover page, which they 
can refresh as their location changes, new Dispos are created, 
or other Dispos die from natural causes.

All Dispos also have a set duration for which they will remain 
alive. Currently, options for Dispo duration range from 6 minutes 
to 24 hours. During the time a Dispo is active, it functions as
one would expect, handling connections, broadcasting join messages
and expiration date reminders exponentially as its time nears,
broadcasting updates from users of the Dispo, and fetching the 
most popular posts of the Dispo so far. Name, duration, 
geographic location, and privacy are currently the supported 
options needed to create a Dispo.

When the time for a Dispo to expire arrives, it will self-destruct,
deleting ALL associated resources that were created for the Dispo
including posts, comments, reactions, and photo uploads before
deleting its own data and terminating its own process under the
supervisor. Ephemerality has always been a fundamental idea
of the app so users should not fear when the Dispo's time comes,
as it has been expressed on the home page, and they have received
reminders incrementally.

With Disposocial, users can make their own temporary space to
interact with others in realtime that will recycle itself, and
discover local pop-up communities around them to socialize with.
I thought this could be potentially useful for a hosted event,
club gathering, neighborhood bulletin, or maybe even a classroom.
Using a Dispo for a temporary event rather than creating a group
chat means you don't have to think about being bothered with 
extraneous messages once the purpose of the chat has passed 
because everyone agrees that the group should disperse after
a duration. It also means the social guilt of leaving a group
chat can be eliminated.

The main concept of my app has evolved from being very
destructive to being slightly less destructive. I abandoned
the idea of also deleting user accounts because I thought it
would be a hindrance to make users create new accounts for every
Dispo they joined. This change came about after I dropped the 
idea of using an SMS api to deliver a one-time password. Apart
from this, my concept has remained largely consistent with my
initial proposal. 

There are many parameters of my implementation, however, which 
have changed since beginning. Some of the changes were due to 
complexity while some were due to time constraints. I struggled
with implementing post tags because of the many to many 
relationship with posts so have had to leave it off of this
version. I unfortunately did not get to implement the
"Favorites" view because other features ended up preceding in
importance or took more than their allotted time. Even though I
created a random id generator, I did not end up using it because
it was quicker to reference dispos by their primary key in the 
database when working with them.

The ways my app meets the project requirements are as follows.

The app is built with a separate front-end and back-end created
using `npx create-react-app` (with the Redux template) and 
`mix phx.new --no-html`. The app exposes a JSON api for session
tokens, user creation, Dispo creation, and photo uploads. 
JWT authentication is required for photo uploads and Dispo 
creation. Once authenticated, most resources are posted and 
fetched on channels which are authenticated with the user's 
token. The front-end receives the messages and updates the
store by which the view is then rendered to the user. The
site is deployed statically on my VPS.

The application supports user accounts with usernames, emails,
and hashed passwords using Argon2. Dispo passwords are also
hashed. Users are stored in my Postgres database along with
their posts for the duration of the Dispo. User accounts are
persisted and location data is not stored. 

The app uses PositionStack's reverse geocoding api to 
translate received latitude and longitude coordinates to
a placename and locality. This is only used when creating
a Dispo to supply other useful metadata and is not used 
when users query local Dispos. The api required an account
and provided the key to make requests.

The app uses Phoenix channels extensively to handle most 
post events and to receive resources on the wire. Broadcasts
to all users of a Dispo are sent on all relevant
updates either on post events, or by the DispoServer
GenServer.

One neat aspect of my app is that it uses Phoenix Presence 
to determine how many users are online in a Dispo in 
realtime. Another interesting aspect is that determining
available Dispos within a user's radius is done using my
implementation of the Haversine algorithm, which calculates
the distance between two points on a sphere given the user's
latitude and longitude, and the radius of Earth, which I 
convert to miles. Finally, I have implemented my own method
of ranking popular posts by caching popular posts on
the DispoServer GenServer incrementally depending on a
variable interaction count, where

  interaction_count = num_comments + num_reactions.

I did this rather than performing an outright query 
because I thought calculating the most popular posts would
be a large query to do for every `fetch_popular_posts` 
especially if it required two operations, querying reactions across 
posts and then retrieving the posts. 

Instead, the DispoServer always has the 
most popular posts ranked by id at the ready and can respond
with them, so then they can be fetched and loaded elsewhere.
An added benefit is that since this state is stored in the
DispoAgent as backup, if a DispoServer ever goes down or 
has to restart, it can continue its popular post caching
where it left off. However, this entails that a popular post 
does not necessarily need to be a well-liked one, just 
high in interactions.

The complex part of my app is the front-end, which has
to organize and store all the updates sent on the wire.
I knew that Redux would be crucial to designing it 
because having one giant state callback like we have
done in Bulls-online would not be suited to incremental
updates. I started designing it by having a `post` 
resource contain everything about itself including 
comments and reactions, but found that it was a lot
of nested data being passed around and that in certain
places, I only wanted parts of it and not all of it
preloaded. I also, only until the last 3 days, stored
`posts` in the front-end as an array. What I later
had to do to prevent loading slowdown was to separate
posts, comments, and reactions into their own reducers
as maps and have post ids be a primary key to get their 
respective comments and reactions when needed from
the store. This ended up making my updates from the
server, such as when a post gets a new like, 
vastly easier to manage because I could dispatch one
reaction by key to the reaction state and increment
the count one update at a time. This also meant
broadcasts could only send what is new and not the
entire post everytime someone makes a comment.

The most significant challenge I faced was executing 
Dispo expiration. This was because all the
teardown steps had to happen exactly in order and
execute correctly because if they didn't, then 
the Dispo would enter a zombie state living past its 
expiration date where undefined behavior would become a
problem. This was also a fundamental feature of the app
so needed to work reliably. All the users needed to be notified
and redirected, clients' websockets needed to be reset,
the clientside Dispo state needed to be 
cleared, all the resources had to be deleted along
with associated data and uploads, and
the DispoServer process needed to terminate 
successfully. To initiate this, I had
the DispoServer GenServer send itself the death
message at its expiration datetime in the future
on creation. Once this message is received, it
broadcasts that the time has come on the channel
topic, assuming connected clients know how to handle
Dispo destruction, before starting its own
self-destruct steps. Even though, I set the 
database associations to `:delete_all` if a parent
is deleted, according to the docs, the deletion
does not cascade and so I had to manually delete
the Dispo's resources in reverse order to prevent
foreign key errors removing an entity that still
had associated children. In the post deletion
step, uploaded media are also deleted from the
save directory by using the media hash field.
Once each sub-step is complete, the Dispo
resource can finally be deleted and the
DispoServer process can return a `:stop`
message. The DispoSupervisor uses the transient
setting for DispoServer processes so will 
let the process exit without attempting to 
restart it. Along the way, I accumulate the 
number of deleted resources for debugging 
purposes and output upon completion. On the 
front-end, there is dedicated channel callback
that will set a global flag to perform clean-up
and redirect the user. The front-end also had to
reset previous discovery results so the recently
deleted Dispo did not appear as a joinable option.

Overall, I acknowledge that there are still many 
pieces that could be improved or implemented.
For one, validation on form input is not consistent across
views of the app but this is something that I had to
forego for the time being to complete other core 
functionality. I have aimed to provide at least sane 
feedback in views where most necessary and add
input guidance on form fields to encourage users
to abide by the validation rules. Normalizing a 
system for outputting errors was another thing that
I had trouble with because of the large amount of 
error scenarios across the board dealing with input
validation and otherwise. This is something that I 
hope to address and add in the next version of 
the app.

Spending so much time with the system has also given
me great insight into what front-end and back-end 
really means. I think I prefer working with Elixir and the
OTP server-side rather than designing views, but have 
respect and appreciation for both sides. I was really amazed
with the amount of work Elixir, Ecto, and Phoenix were able to 
do for me throughout as well. I am happy with how the
app developed so far, and am looking forward to continue
improving it going into the future.



April 10, 2021
