library(pacman)
p_load(this.path, ggplot2)

setwd(this.path::this.dir())
source('../lib/data-access.R')
source('../lib/plot.R')

plot_hist_collection(
  collection_name = 'hist_top_10_danceability',
  name            = 'Danceability',
  binwidth        = 0.05
)

plot_hist_collection(
  collection_name = 'hist_top_10_energy',
  name            = 'Energy',
  binwidth        = 0.05
)

plot_hist_collection(
  collection_name = 'hist_top_10_loudness',
  name            = 'Loudness',
  binwidth        = 1
)

plot_hist_collection(
  collection_name = 'hist_top_10_speechiness',
  name            = 'Speechiness',
  binwidth        = 0.03
)

plot_hist_collection(
  collection_name = 'hist_top_10_acousticness',
  name            = 'Acousticness',
  binwidth        = 0.05
)

plot_hist_collection(
  collection_name = 'hist_top_10_instrumentalness',
  name            = 'Instrumentalness',
  binwidth        = 0.1
)

plot_hist_collection(
  collection_name = 'hist_top_10_liveness',
  name            = 'Liveness',
  binwidth        = 0.05
)

plot_hist_collection(
  collection_name = 'hist_top_10_valence',
  name            = 'Valence',
  binwidth        = 0.05
)

plot_hist_collection(
  collection_name = 'hist_top_10_tempo',
  name            = 'Tempo',
  binwidth        = 7
)

plot_hist_collection(
  collection_name = 'hist_top_10_duration_ms',
  name            = 'Duration MS',
  binwidth        = 20000
)


# Correlación entre la variables

track_features_top_1_num_colllection <- get_collection('track_features_top_1_num')
num_features <- track_features_top_1_num_colllection$find()
num_features.cov <- cov(scale(num_features))

plot_heatmap(num_features.cov)




