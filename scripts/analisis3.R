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

track_features <- get_tracks('track_features_top_10')


track_features$famous <- as.factor(
  ifelse(track_features$position <= 1, "Y","N" )
)

track_features %>% arrange(position)


X <- track_features %>% select_if(is.numeric) %>% select(-position)
y = track_features$famous

model <- randomForest(x=X, y=y, importance=TRUE, ntree=4000)
varImpPlot(model)




