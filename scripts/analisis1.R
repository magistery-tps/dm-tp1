library(pacman)
p_load(this::path, tidyverse, WVPlots, GGally, egg, ggpubr, randomForest)
setwd(this.path::this.dir())
source('../lib/data-access.R')

num_cols <-c(
  'danceability', 'energy', 'loudness', 
  'speechiness', 'acousticness', 
  'instrumentalness', 'liveness',
  'valence', 'tempo', 'duration_ms'
)

get_track_features <- function(collection) {
  track_features <- get_collection(collection)
  data <- track_features$find(
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
  unique(data)
}
# 
# 
#
# 
# 
# Cuales son los temas que mas veces estuvieron en el top 10?
# 
track_features_top_10 <- get_track_features('track_features_top_10')

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
  slice_head(n = 10) %>%
  mutate(name = fct_reorder(artist_track, desc(median_positon))) %>%
  ggplot( aes(x=name, y=median_positon)) +
  geom_bar(stat="identity", fill="#69b3a2", alpha=.6, width=.4) +
  coord_flip() +
  xlab("") +
  theme_bw()
# 
# 
#
#
#
# Evolucion de features x position:
# 
track_features_top_10 <- get_track_features('track_features_top_10')

position_features <- track_features_top_10 %>%
  group_by(position) %>%
  summarise_at(vars(num_cols), median)

g1 <- qplot(
  x=position, 
  y=danceability, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g2 <- qplot(
  x=position, 
  y=energy, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g3 <- qplot(
  x=position, 
  y=loudness, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g4 <- qplot(
  x=position, 
  y=speechiness, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g5 <- qplot(
  x=position, 
  y=acousticness, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g6 <- qplot(
  x=position, 
  y=instrumentalness, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g7 <- qplot(
  x=position, 
  y=liveness, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g8 <- qplot(
  x=position, 
  y=valence, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g9 <- qplot(
  x=position, 
  y=tempo, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
g10 <- qplot(
  x=position, 
  y=duration_ms, 
  data = position_features, 
  geom = c("point", "smooth"), 
  formula='y ~ x', 
  method = 'loess'
)
ggarrange(
  g1, g2, g3, g4, g5,
  g6, g7, g8, g9, g10,
  ncol=5,
  nrow=2
)


position_features$famous <- as.factor(ifelse(position_features$position <= 1, "Y","N" ))
names(position_features)

X <- position_features %>% select_if(is.numeric) %>% select(-position)
names(X)
y = position_features$famous

model <- randomForest(x=X, y=y, importance=TRUE, ntree = 1000)
varImpPlot(
  model,
  main="Importancia de caracteristicas para permanecer en la posicion 1  del top 10",
  bg = "skyblue", 
  cex=1,
  pch=22
)
