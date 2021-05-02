library(pacman)
p_load(this.path)
source(paste(this.path::this.dir(), '/lib/import.R', sep=''))

import('lib/data-access')


track_weekly_top_200 <- get_collection('track_weekly_top_200')
track_features <- get_collection('track_features')
countries <- get_collection('countries')


result <- track_features$find('{}', limit = 10)
names(result)

result <- countries$find('{}', limit = 10)
names(result)

result <- track_weekly_top_200$find('{}', limit = 10)
names(result)

