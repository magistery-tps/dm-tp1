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
  unique(data)
}
#
#
#
#
#
#
#
#
track_top_10 <- get_tracks('track_features_top_1')

artist_track_week_position <- track_top_10 %>%
  group_by(artist_track, week_start, position) %>%
  tally(name = 'count') %>%
  arrange(artist_track, week_start, position)  %>%
  select(-count)
# View(artist_track_week_position)
#
#
#
#
#
#
#
#
artist_track_reproductions <- track_top_10 %>%
  group_by(artist_track, reproductions) %>%
  tally(name = 'count') %>%
  arrange(desc(reproductions)) %>%
  select(-count)
# View(artist_track_reproductions)


artist_track_week_position_ordered_by_reproductions <- left_join(
  artist_track_reproductions, 
  artist_track_week_position, 
  by='artist_track'
) %>%
arrange(desc(reproductions)) %>%
select(artist_track, week_start, position)
# View(artist_track_week_position_ordered_by_reproductions)
#
#
#
#
#
#
#
#
# Cuales son los estuvieron menos tiempo en el top 10?
artist_track_min_week <- artist_track_week_position %>%
  group_by(artist_track) %>%
  tally(name = 'count') %>%
  arrange(count) %>%
  slice(1:10)

# View(artist_track_min_week)

# Una semana
#
#
#
#
#
#
#
#
# Cuales son los estuvieron mas tiempo en el top 10?
artist_track_max_week <- artist_track_week_position %>%
  group_by(artist_track) %>%
  tally(name = 'count') %>%
  arrange(desc(count)) %>%
  slice(1:5)

View(artist_track_max_week)
#
#
#
#
#
#
#
#
# Exitos de una semana en el top 10?
artist_track_features_by_week_count <- function(
  artist_track_week_position,
  artist_track_features,
  weeks_count=1
) {
  artist_track_week_positionX_weeks <- artist_track_week_position %>%
    group_by(artist_track) %>%
    tally(name = 'count') %>%
    arrange(count) %>%
    filter(count <= weeks_count)

  left_join(
    artist_track_week_positionX_weeks,
    artist_track_features,
    by='artist_track') %>%
    select(num_cols, -count) %>%
    summarise_all(median)
}



week_features <- NULL
max_weeks <- artist_track_max_week$count[1]
count <- 0
for(i in 1:max_weeks) {
  row <- artist_track_features_by_week_count(
    artist_track_week_position,
    track_top_10,
    weeks_count = i
  )
  
  row[,"weeks"] <- i
  
  
  count <- count +  nrow(row)

  if(is.null(week_features)) {
    week_features <- row  
  } else {
    week_features <- week_features %>% bind_rows(row)
  } 
}
print(count)
View(week_features)



g1 <- qplot(
  x=weeks, 
  y=danceability, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g2 <- qplot(
  x=weeks, 
  y=energy, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g3 <- qplot(
  x=weeks, 
  y=loudness, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g4 <- qplot(
  x=weeks, 
  y=speechiness, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g5 <- qplot(
  x=weeks, 
  y=acousticness, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g6 <- qplot(
  x=weeks, 
  y=instrumentalness, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g7 <- qplot(
  x=weeks, 
  y=liveness, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g8 <- qplot(
  x=weeks, 
  y=valence, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g9 <- qplot(
  x=weeks, 
  y=tempo, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g10 <- qplot(
  x=weeks, 
  y=duration_ms, 
  data = week_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
ggarrange(
  g1, g2, g3, g4, g5,
  g6, g7, g8, g9, g10,
  ncol=5
)



# Que caracteristicas tiene estos exitos solo estan una semana vs
# los que estan el maximo posible ?



