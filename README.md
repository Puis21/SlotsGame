<h1 align= "center">PLEASE READ FOR MORE INFO ABOUT PROEJCT</h1>

This the prototype for the AVATAR UX test project. I wanted to add more detail here about my decisions and thought process.

After some research, I decided to go with the route of adding different probabilities for each symbol for each of the 5 reels.

There are 7 win lines I decided to go with(taking into consideration a win can be 3 >= symbols):
* All of the 3 rows
* Diagonal 1 : [0, 0], [1, 1], [2, 2], [1, 3], [0, 4]
* Diagonal 2 : [2, 0], [1, 1], [0, 2], [1, 3], [2, 4]
* Diagonal 3 : [0, 0], [1, 1], [2, 2], [2, 3], [2, 4]
* Diagonal 4 : [2, 0], [1, 1], [0, 2], [0, 3], [0, 4]

I could've added many more diagonals that can be considered classic but I wanted to keep it simple. I also noticed at the end a fault in my design but that can be fixed or expanded upon. For example, let's say the player gets 3 of the same symbols on diagonal 3 and it looks like this [2, 2], [2, 3], [2, 4]. The game will count that as a win because there are 3 of
the same symbols in order but also as a win for row 2 because they are part of it. So I am not sure if this is good or if it should changed into considering the win for the diagonals if at least one of the symbols is not on the same row with the others.

I also searched on how to calculate the RTP in general and I included another file, named RPTCalc and it seems the RPT for my chosen values is around 92%, which is inside the values of 85% and 98% that are needed for a legal slot machine. However, I am not sure for what amount of time is the player supposed to earn that amount back if he spends enough. I think it
was worthwhile to check some RTP calculus because before the value with my random values inserted was around 2-5% which is bad.

Thank you for considering my application,
<p>Puia Catalin</p>
