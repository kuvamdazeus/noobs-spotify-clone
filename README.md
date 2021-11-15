# A NextJS Project ❤️
###### Go to /library after signing in or in 'Your Library' section to get recommendations based upon songs in your playlist
###### Note: if the library page is not working, its probably because of the "Free dyno hour quota exceed" of heroku
###### Note: If you dont have a spotify account, use email: noobs.spotify.clone@gmail.com, password: spotifyclone (to test the app)
----------
## Features & functionality 💯:
   1. Recommend songs to the user based on its tracks saved in spotify playlists (ML server code repo linked below)
   2. Play songs then & there with youtube's playback (spotify web playback was not used as it required user to be premium)
   3. Search artists, albums & tracks and also play them
   4. Display user's recent albums, artists & tracks
----------
## Bugs & issues 🐞

### 1. Recommendations are not VERY accurate
Reason:
  The backend code also is not searching full dataset of 500,000 tracks and recommends only from popular songs
  i did this because the whole dataset contained 100's of different languages and there is no 'language' column in dataset
  to reveal the language, i have to use the spotifyApi with the access_token on the frontend, doing that for all recommended songs
  was a heavy job on the machine and user would have to wait a much longer
  So we get less songs to predict

### 2. Not FULLY-RESPONSIVE for mobile devices
Reason:
  In 1st first place, i didnt meant to make the app for mobile devices, but when i decided that it should be on phone too, i got a little late
  as the app was about to be completed and wasnt structured according to small resolutions, so the most i could do was to show user an alert
  to use their phones in landscape mode 😅

### 3. Doesn't works if user has too many songs in his/her playlists
