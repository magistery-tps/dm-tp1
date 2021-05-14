library(pacman)
p_load(this::path, tidyverse, WVPlots, GGally, egg)
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
  slice_head(n = 10) %>%
  mutate(name = fct_reorder(artist_track, desc(median_positon))) %>%
  ggplot( aes(x=name, y=median_positon)) +
  geom_bar(stat="identity", fill="#69b3a2", alpha=.6, width=.4) +
  coord_flip() +
  xlab("") +
  theme_bw()




track_features_top_200 <- get_track_features('track_features_top_200')
  
num_cols <- c('danceability', 'energy', 'loudness', 'speechiness', 
              'acousticness', 'instrumentalness', 'liveness',
              'valence', 'tempo', 'duration_ms')

position_features <- track_features_top_200 %>%
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
  mutate_at(num_cols, scale)

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
  y=livenes, 
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
  ncol=2
)



track_features_top_200 <- get_track_features('track_features_top_50')
r <- track_features_top_200 %>%
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
  )
PairPlot(
  r,
  colnames(r)[2:11],  " ", 
  group_var = "position", 
  palette=NULL
)
+ ggplot2::scale_color_manual(values=unique(as.factor(r$position)))







g_hist <- function(
  values, 
  name = '', 
  font_size = 10, 
  cant_bins = 50,
  colour = 'blue'
) {
  qplot(
    values, 
    geom     = "histogram", 
    main     = paste('Histograma', name),  
    xlab     = name,
    ylab     = 'Frecuencia', 
    binwidth = diff(range(values)) / cant_bins,
    fill     = "green"
  ) + 
    theme(text = element_text(size = font_size)) +
    guides(fill=FALSE)
}
g_hist_df <- function(df, col) g_hist(as.vector(unlist(df[col])), col)


track_features_top_200 <- get_track_features('track_features_top_200')

u1 <- g_hist_df(track_features_top_200, 'danceability')
u2 <- g_hist_df(track_features_top_200, 'energy')
u3 <- g_hist_df(track_features_top_200, 'loudness')
u4 <- g_hist_df(track_features_top_200, 'speechiness')
u5 <- g_hist_df(track_features_top_200, 'acousticness')
u6 <- g_hist_df(track_features_top_200, 'instrumentalness')
u7 <- g_hist_df(track_features_top_200, 'liveness')
u8 <- g_hist_df(track_features_top_200, 'valence')
u9 <- g_hist_df(track_features_top_200, 'tempo')
u10 <- g_hist_df(track_features_top_200, 'duration_ms')

ggarrange(
  u1, u2, u3, u4, u5,
  u6, u7, u8, u9, u10,
  ncol=2
)

