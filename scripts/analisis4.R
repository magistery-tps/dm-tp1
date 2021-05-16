library(pacman)
p_load(this::path, tidyverse, WVPlots, GGally, egg)
setwd(this.path::this.dir())
source('../lib/data-access.R')

num_cols <- c(
  'danceability', 'energy', 'loudness',
  'speechiness', 'acousticness', 
  'instrumentalness', 'liveness',
  'valence', 'tempo', 'duration_ms'
)

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
      "week_end": true,
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
  data$week_end <- as.Date(data$week_end,format="%Y-%m-%d")
  unique(data)
}

track_top_10 <- get_tracks('track_features_top_10')
#
#
#
#
#
#
#
#
# Pregunta N°4: Los temas que se encuentran en el top 1 y salen de él 
# (caen de posición) ¿Cuantas semanas pasan hasta que cae por debajo 
# del Top 3 / Top 5 / Top 10
#
artist_track_weeks_between_postions <- function(df, from=1, to=1) {
  df %>%
    filter(
      position >= from,
      position <= to
    ) %>%
    group_by(artist_track) %>%
    summarise(
      week_start = max(week_start),
      weeks      = n(),
      week_end   = max(week_end)
    ) %>%
    as.data.frame()
}
#
#
#
# Cuantas semanas estuvo un artista en el top 2 y cual fue la ultima semana?
artist_track_top_1 <- artist_track_weeks_between_postions(track_top_10)
head(artist_track_top_1)
#
#
#
#
artist_track_top_2_3 <- 
  artist_track_weeks_between_postions(track_top_10, from=2, to=3)
head(artist_track_top_2_3)

artist_track_top_4_5 <- 
  artist_track_weeks_between_postions(track_top_10, from=4, to=5)
head(artist_track_top_4_5)

artist_track_top_6_10 <- 
  artist_track_weeks_between_postions(track_top_10, from=6, to=10)
head(artist_track_top_6_10)
#
#
#
#
# Semanas entre posiciones para los que descienden del top 1:
result_2_3 <- 
  artist_track_top_1 %>%
  left_join(artist_track_top_2_3, by='artist_track', suffix = c(".top1", ".top2-3")) %>%
  filter('week_end.top1' <= 'week_start.top2-3') %>%
  select('artist_track', 'weeks.top1', 'weeks.top2-3', 'week_end.top2-3')
head(result_2_3)

result_4_5 <- 
  result_2_3 %>%
  left_join(artist_track_top_4_5, by='artist_track') %>%
  mutate_if(is.numeric, ~replace(., is.na(.), 0)) %>%
  filter('week_end.top2-3' <= 'week_start') %>%
  rename ('weeks.top4-5' = weeks, 'week_end.top4-5' = week_end) %>%
  select('artist_track', 'weeks.top1', 'weeks.top2-3', 'weeks.top4-5', 'week_end.top4-5')
head(result_4_5)

result_6_10 <- 
  result_4_5 %>%
  left_join(artist_track_top_6_10, by='artist_track') %>%
  mutate_if(is.numeric, ~replace(., is.na(.), 0)) %>%
  filter('week_end.top4-5' <= 'week_start') %>%
  rename ('weeks.top6-10' = weeks) %>%
  select('artist_track', 'weeks.top1', 'weeks.top2-3', 'weeks.top4-5', 'weeks.top6-10')
head(result_6_10)

nrow(result_6_10)


