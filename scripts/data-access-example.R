library(pacman)
p_load(this::path)
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
# 
# 
#
# 
# 
# Cuales son los temas que mas veces estuvieron en el top 10?
# 
track_features_top_10 %>%
  group_by(artist_track) %>%
  tally(name='times') %>%
  arrange(desc(times)) %>%
  mutate(name = fct_reorder(artist_track, times)) %>%
  slice_head(n = 10) %>%
  ggplot( aes(x=name, y=times)) +
  geom_bar(stat="identity", fill="#f68060", alpha=.6, width=.4) +
  coord_flip() +
  xlab("") +
  theme_bw()
# 
# 
#
#
#
# Cuales es la media de la posición de cada tema?
# 
track_features_top_10 %>%
  group_by(artist_track) %>%
  summarise(median_positon = median(position)) %>%
  arrange(median_positon) %>%
  slice_head(n = 50) %>%
  mutate(name = fct_reorder(artist_track, desc(median_positon))) %>%
  ggplot( aes(x=name, y=median_positon)) +
  geom_bar(stat="identity", fill="#69b3a2", alpha=.6, width=.4) +
  coord_flip() +
  xlab("") +
  theme_bw()

track_features_top_100 <- get_track_features('track_features_top_100')
  
position_features <- track_features_top_10 %>%
  group_by(position) %>%
  summarise(
    danceability = median(danceability),
    energy = median(energy),
    loudness = median(loudness),
    speechiness = median(speechiness),
    acousticness = median(acousticness),
    instrumentalness = median(instrumentalness),
    livenes = median(liveness),
    valence = median(valence),
    tempo = median(tempo),
    duration_ms = median(duration_ms)
  ) %>%
  mutate_at(
    c('danceability', 'energy', 'loudness', 'speechiness', 
      'acousticness', 'instrumentalness', 'livenes',
      'valence', 'tempo', 'duration_ms'),
    scale
  ) %>%
  arrange(desc(position))

ggplot(position_features, aes(x=position, y=danceability)) +
  geom_area( fill="#69b3a2", alpha=0.5) +
  geom_line(color="#69b3a2", size=1) +
  ggtitle("Evolution of something")
