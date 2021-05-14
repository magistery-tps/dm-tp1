library(pacman)
p_load(this::path, tidyverse, WVPlots, GGally)
setwd(this.path::this.dir())
source('../lib/data-access.R')

get_tracks <- function(collection) {
  collection <- get_collection(collection)
  data <- collection$find(
    '{}', 
    fields = '{
      "_id": false,
      "name": true,
      "artist": true,
      "position": true,
      "week_start": true,
      "danceability": true,
      "energy": true,
      "loudness": true,
      "speechiness": true,
      "acousticness": true,
      "instrumentalness": true,
      "liveness": true,
      "valence": true,
      "tempo": true,
      "duration_ms": true,
      "reproductions": true
    }'
  ) %>%
  drop_na %>%
  within(artist_track <- paste(artist, name, sep=' - '))
  data$week_start <- as.Date(data$week_start,format="%Y-%m-%d")
  data
}

num_cols <- c('danceability', 'energy', 'loudness', 'speechiness', 
              'acousticness', 'instrumentalness', 'liveness',
              'valence', 'tempo', 'duration_ms')



track_top_10 <- get_tracks('track_features_top_10')
names(track_top_10)

artist_track_week_position <- track_top_10 %>%
  group_by(artist_track, week_start, position) %>%
  tally(name = 'count') %>%
  arrange(artist_track, week_start, position)  %>%
  select(-count)
View(artist_track_week_position)



artist_track_reproductions <- track_top_10 %>%
  group_by(artist_track, reproductions) %>%
  tally(name = 'count') %>%
  arrange(desc(reproductions)) %>%
  select(-count)

View(artist_track_reproductions)


artist_track_week_position_ordered_by_reproductions <- left_join(
  artist_track_reproductions, 
  artist_track_week_position, 
  by='artist_track'
) %>%
arrange(desc(reproductions)) %>%
select(artist_track, week_start, position)

View(artist_track_week_position_ordered_by_reproductions)

# Cuales son los estuvieron menos tiempo en el top 10?
artist_track_week <- artist_track_week_position %>%
  group_by(artist_track) %>%
  tally(name = 'count') %>%
  arrange(count) %>%
  slice(1:10)

View(artist_track_week)

# Una semana

# Cuales son los estuvieron mas tiempo en el top 10?


artist_track_week <- artist_track_week_position %>%
  group_by(artist_track) %>%
  tally(name = 'count') %>%
  arrange(desc(count)) %>%
  slice(1:5)

View(artist_track_week)

# Exitos de una semana en el top 10?
artist_track_1_week_top_10 <- artist_track_week_position %>%
  group_by(artist_track) %>%
  tally(name = 'count') %>%
  arrange(count) %>%
  filter(count <= 1)


artist_track_features_top_10 <- track_top_10 %>%
  select(c(artist_track, num_cols))
names(artist_track_features_top_10)

artist_track_1_week_features <- left_join(
    artist_track_1_week_top_10,
    artist_track_features_top_10,
    by='artist_track'
  ) %>%
  summarise_if(is.numeric, median) %>%
  select_if(is.numeric)

# Que caracteristicas tiene estos exitos solo estan una semana vs
# los que estan el maximo posible ?

View(artist_track_1_week_features)


