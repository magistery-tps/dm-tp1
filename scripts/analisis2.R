library(pacman)
p_load(this::path, tidyverse, WVPlots, GGally)
setwd(this.path::this.dir())
source('../lib/data-access.R')

get_track_features <- function(collection) {
  track_features <- get_collection(collection)
  track_features_table <- track_features$find(
    '{}', 
    fields = '{
      "_id": false,
      "name": true,
      "artist": true,
      "position": true,
      "danceability": true,
      "energy": true,
      "loudness": true,
      "speechiness": true,
      "acousticness": true,
      "instrumentalness": true,
      "liveness": true,
      "valence": true,
      "tempo": true,
      "duration_ms": true
    }'
  ) %>%
  drop_na %>%
  within(artist_track <- paste(artist, name, sep=' - '))
}

track_features_top_10 <- get_track_features('track_features_top_10')
nrow(track_features_top_10)
names(track_features_top_10)
