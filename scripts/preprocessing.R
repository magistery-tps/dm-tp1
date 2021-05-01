library(pacman)
p_load(this.path)
source(paste(this.path::this.dir(), '/lib/import.R', sep=''))

import('lib/data-access')


track_features <- get_collection('track_features')
result <- track_features$find('{}', limit = 10)
names(result)
