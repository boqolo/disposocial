## Final Project Proposal: Disposocial

When the parameters for the final project were released, 
I was stoked to begin what I knew would be the most 
ambitious of the projects thus far, but also struck
with the uncertainty that comes with charting new terrain.
I had a few ideas brewing but had to carefully weigh all 
of my options for their complexity, suitability, and my interests. 
I deliberated this topic amongst myself and some companions 
on what it was I should do that could be of some real world use.
However, I am now pleased to have committed to the idea of what I
will henceforth call Disposocial.

Disposocial is, as its name might suggest, a disposable 
social network. To expand, it is a localized, duration-based, 
self-destructing bulletin/chat room/social media. 
This is the vision at least.

To be specific, on Disposocial user accounts are ephemeral
by design (also convenient due to the lack of disk space on my
VPS). If there is a disposable social
network server (henceforth called a 'Dispo' because branding) 
active within a radius (perhaps 1 mile) of the user's location, 
they may create an account and join it.
If one does not exist, they may create one themselves. ALL Dispos
have a set duration such that when the duration is complete, the 
Dispo self-destructs. Once the Dispo self-destructs, all user 
accounts and content associated with it get deleted. This would be
an option that the creating user could specify (1 hour, 1 day, 2 days, 
1 week). Once in a Dispo, Disposocial acts like a rudimentary
social media platform, allowing text posts, small multimedia content,
post tags, live presence, having a live global feed, and a ticker with
updates when people join. 

The idea is an experiment with creating a custom social space
that is lightweight, easy to use, and laidback. Yes, there are many
social medias and networks that exist. However, hopefully Disposocial
will stand out because of the emphasis on locality and its 
relatively private nature since you can only view Dispos around you.
Disposocial tries to land somewhere in between the functionality of
a Discord server (ease of use + informality) and YikYak (location 
based). The latter I really thought was a cool idea but unfortunately 
it was discontinued because of rampant cyber-bullying. This was
a worrisome observation because Dispos also use anonymity but not 
one that is top of mind at this stage of development.

To be frank, I am not so much a social media user myself.
I was influenced by a long conversation that I had with a friend who
expressed their discontentment with popular platforms due to 
a lack of granularity when it comes to controlling how much of your 
content you expose to certain people or parts of the platform. Having
now some experience with Elixir, Phoenix, and OTP, I thought 
undertaking this derivative idea would be a perfect exercise.

What are the use cases?

A club or other organizational gathering could create group 
communication without forming a permanent groupchat that we know 
we'll forget to leave and will more than likely annoy us in the 
future when its use is definitely expired but at least one person is
still sending memes to an unresponsive crowd. A slightly adapted
case is if there were a Dispo at a restaurant and guests could
throw out recommendations or post comments about their experience
(e.g. "The tomato soup is good today, would definitely order it").
Newcomers could log on (because the Dispo is in their vicinity) and
read about how others are liking their food without gawking at
others' plates. A neighborhood or apartment Dispo could be handy
to stay in the know about happenings or interact virtually with
local people. A group of friends might like to just make their 
own space to goof off and not feel inhibited by the eyes of the 
world.

At any rate, the common denominator of the use cases could be 
described in a user story that goes something like this:

- Boqolo visits the site
- There are no active Dispos in Boqolo's vicinity
- He chooses to create one for 1 hour to chat with friends
- He enters a user id and a password
- He is logged in and has access to the social space
- He can see stats about how many have joined, are online, 
  and how much time is left before the Dispo self-destructs
- He creates a post, "first post! I am alone in here" and 
  tags it "OG"
- It populates the feed and the new tag shows up as a category
- He clicks an 'Invite' button to send the link to his friend
- The friend clicks the link and is taken to the "Join" page
- The friend follows the same auth-flow and logs in
- Boqolo sees the live update of the friend joining
- The friend accidentally closed the tab
- The friend opens a new window and sees her session is persisted
- Boqolo clicks the friend's name from the user list and can see
  her profile along with some basic stats
- The friend tells her friend in Detroit about Disposocial
- The Detroit friend visits the site but cannot join Boqolo's
  Dispo because they are not in the same geographical vicinity
- She sees her neighborhood has an active Dispo and joins
- After a good time with friends, Boqolo says goodbye, and 
  clicks "Exit"
- He is prompted that his account will be closed and clicks "Ok"
- The first friend sees that he is no longer online but can
  still see his posts in the feed and click on his profile
- After some time, the friend sees that the Dispo will expire soon
  and exits early.
- The next day, Boqolo visits the site and does not see any active
  Dispos because it has been deleted
- Boqolo tries to visit the url but there is no access


The following is a more precise user story dedicated to content
posting and user interactions:

- Boqolo has had a witty thought he would like to share. He 
  clicks the "New post" button
- On the post creation screen, he writes his thoughts, adds a photo,
  adds a custom tag, and clicks "Post it"
- The post shows up in his feed screen
- The post receives multiple comments
- George sees the post and its impressive number of comments. 
  He clicks the post to view the conversation
- He clicks the user's profile and can see their posts. He goes back.
- He gives the post a like
- He goes back to the main feed screen and chooses to sort by 
  like count. The screen refreshes and he gets the most popular
  posts at the top.
- He scrolls to the bottom and loads 10 more posts
- He presses the "meme" tag from the list of tags and gets all
  posts tagged meme
- He presses the "Liked Posts" tab from the main screen and
  sees all his favorite posts

The development team for this project is composed
of myself. The API I plan to use is PositionStack for reverse
geocoding the user's coordinates into a friendly location that
can be displayed in the Dispo as part of the UI. 
Realtime behavior will be encompassed
by the live feed/timeline which in the backend will be a Phoenix
Channel broadcast to connected users of the Dispo on
dispatchable actions depending on if they are on a certain screen.
Apart from users, I will be using Postgres to store the Dispo and
its critical metadata (when created, by who, global updates, etc).
The neat feature that I want to do is the geolocation aspect, which
will use the HTML Location API and maybe also the Browser 
Visibility API for presence detection if I have the time.

The Location API was the first of my tests and I used it to
get familiar with the module, determine what stage in the user 
story it would work, and how complicated it would be. I found that 
it was very straightforward to use and wrote basic code with it 
before experimenting some more in the console. I initially thought I 
could find an external api to locate the user along with getting
some extra info (city, country) by IP but ruled this out because
it wouldn't necessarily be accurate to use locations based on IP.
A quick test using an external geo API when on my cellular hotspot
proved this. Therefore, HTML Geolocation was the best tool for 
getting device even if there was a degree of uncertainty of
about 65 meters. I can account for this when doing radius 
calculations later on and it wouldn't be too worrying of an oversight.

My second test actually was the Twilio SMS API because I had 
initially thought that I wanted to use it before changing plans and 
removing SMS functionality altogether. I did majority of my testing
with HTTP clients from an iex session trying to make SMS requests to
send a text to my phone. I ran into problems with this quickly mainly
to do with formatting my request and using the libraries. Twilio was
not recognizing the body parameters I was sending in the body and I
could not figure out where my requests were malformed. I even tried
packet sniffing requests leaving my mac to no avail. After spending
a lot of time debugging my api requests and switching out 
three different Elixir HTTP Client libraries (HTTPoison, Mint, and
Finch), I tried a different API called D7SMS. This process went more
smoothly for me but the messages were sent quite slow (15+ seconds 
delay). I originally planned to use SMS to send a one-time password 
that a user could log in with to get a session token but was having 
some doubts about it now.

Our last class on March 19 coincidentally was about password security
and ultimately influenced me further to avoid depending on SMS in
my authentication flow. I also did not want to spend extra time 
figuring out why my messages were being sent slowly, verifying outbound
numbers, or getting Twilio to recognize my request headers. For 
those reasons, I decided to depart from Twilio and find another API
to use, and this is when I found PositionStack for reverse geocoding.

I did a third little test on random word generation for Dispo
names (to be used for URLs) sourced from a file. It was successful.
I plan to spawn a GenServer that can yield such random ids when
creating Dispos.

In hindsight, my plans changed drastically over the course of thinking
about the parameters of the project, specific implementation details,
and testing out my APIs. I was leaning towards this idea for up to a week
before the the due date of the proposal, but really only solidified the 
most important details in the last 24 hours. Thinking more about how
to simplify the intended user experience reduced much of the overhead
that had previously caused me to miss certain details. One example was
how I had initially tried to force the SMS API on to it when it really
wasn't called for. 

I suppose I will also address my motivations for working alone on this
more significant project. I certainly had my doubts approaching it 
solo mainly because I knew how much of an investment (of time, 
practice, patience, and otherwise) previous assignments had been. 

I write this document as a student in my last year at 
Northeastern University. Endeavoring a project which "expects" teams
of four people alone meant accepting the consequences of a project
which, at the end of a rapid three weeks, may not have all 
functionality working as planned. My grade in the class was 
something I did not initially want to risk, but I soon 
realized that the odds were not bad, and I couldn't help but throw
myself in the water to see if I could swim.

I have done some personal projects before, but nothing of this
complexity, and so I saw this opportunity in many ways as a coming
of age or a culmination. I am also tired of being subservient to a
decimal number or letter grade and wish to reaffirm, by my own 
metric, why I chose the CS life as an undeclared student my
sophomore year. Apart from this, there is plenty of ripe example 
code to reference and the assignments have I think given me a lot to
work with. These were my justifications although I did still attempt
to form or join a team before arriving at this conclusion.

As it stands, I will conclude with an outline my angle of attack 
for the composite tasks of the project, as this will be crucial to 
keeping myself on track. I have sketched roughly the components of 
the system and the tools that they will be implemented but these 
descriptions are subject to change.

0. Experiment with Redux
1. Create the project (mix new phoenix --sup && npx cra-redux)
2. Setup domain and deploy
3. Add bootstrap
4. setup postgres locally
5. configure phoenix channels and send geolocation (BIG)
6. create DB migrations (BIG)
7. implement secure passwords
8. implement resource context modules
9. implement front end redux (BIG)
10. implement random-id GenServer
11. implement Dispo GenServer with Dynamic Supervisor + Registry (BIG)
12. implement auth + dispo existance Plugs
13. Fill in all the holes
14. Make the video presentation

I anticipate the most challenging aspect to be working with Redux 
because I do not at the moment have much experience with it. 

This has been Rayyan's Final Project Proposal.

Spring 2021

