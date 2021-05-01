library(pacman)
p_load(stringi, tidyverse, this.path)
source(paste(this.path::this.dir(), '/lib/import.R', sep=''))

import('lib/data-access')


track_features_col <- get_collection('track_features')
track_features <- as.data.frame(track_features_col$find('{}'))


track_features.numeric <- track_features %>% select(where(is.numeric))

names(track_features.numeric)
