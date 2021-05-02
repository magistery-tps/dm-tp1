library(pacman)
p_load(this.path)
source(paste(this.path::this.dir(), '/../lib/import.R', sep=''))

import('../lib/data-access')


hist_top_10_danceability <- get_collection('hist_top_10_danceability')

result <- hist_top_10_danceability$find('{}')
names(result)

