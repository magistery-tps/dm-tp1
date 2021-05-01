library(pacman)
p_load(stringi, tidyverse, this.path, readr)
source(paste(this.path::this.dir(), '/lib/import.R', sep=''))

import('lib/data-access')


track_real_features.num <- get_collection('track_real_features.num')

# Veamos las distribuciones de cada variable numérica:

result <- track_real_features.num$find(fields = '{ "danceability" : 1}')

hist(result $danceability)
