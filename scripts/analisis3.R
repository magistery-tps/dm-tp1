library(pacman)
p_load(this::path, tidyverse, randomForest, ggrepel, devtools, ggbiplot)
setwd(this.path::this.dir())
source('../lib/data-access.R')

get_tracks <- function(collection) {
  collection <- get_collection(collection)
  collection$find(
    '{}',
    fields = '{
      "_id": false,
      "artist": true,
      "name": true,
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
  within(artist_track <- paste(artist, name, sep=' - ')) %>%
  unique()
}

track_features <- 
  get_tracks('track_features_top_200') %>%
  group_by(artist_track) %>%
  summarise_if(is.numeric, median)

track_features$famous <- as.factor(
  ifelse(track_features$position <= 10, "Y","N" )
)

model <- randomForest(
  x = track_features %>% select_if(is.numeric) %>% select(-position),
  y = track_features$famous, 
  importance=TRUE,
  ntree=4000
)

varImpPlot(model)



# ------------------------------------------------------------------------------


features <- get_tracks('track_features_top_200') %>%
  select_if(is.numeric) %>%
  select(-position) %>%
  summarise_all(mean)
names(features)


features.pc <- prcomp(features, scale = TRUE)
summary(features)




