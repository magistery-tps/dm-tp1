library(pacman)
pacman::p_load(tidyverse, mongolite)
#
#
#
SPOTIFY_DATABASE = "mongodb://localhost:27017/spotify"
get_collection <- function(name) { 
    mongo(collection=name, url = SPOTIFY_DATABASE)
}
#
#
#
track_weekly_top_200 <- get_collection('track_weekly_top_200')
track_features <- get_collection('track_features')
countries <- get_collection('countries')
#
#
#
result <- track_features$find('{}', limit = 10)
names(result)

result <- countries$find('{}', limit = 10)
names(result)

result <- track_weekly_top_200$find('{}', limit = 10)
names(result)
