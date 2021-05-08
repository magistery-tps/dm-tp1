library(pacman)
p_load(this::path)
setwd(this.path::this.dir())
source('../lib/data-access.R')

track_features <- get_collection('track_features_top_200')
track_features_table <- track_features$find('{}', fields = '{"markets" : false}')
write.csv(
  track_features_table, 
  paste(getwd(), "../dataset/track_features_top_200.csv", sep="/"), 
  row.names = TRUE
)

track_features <- get_collection('track_features_top_100')
track_features_table <- track_features$find('{}', fields = '{"markets" : false}')
write.csv(
  track_features_table, 
  paste(getwd(), "../dataset/track_features_top_100.csv", sep="/"), 
  row.names = TRUE
)

track_features <- get_collection('track_features_top_50')
track_features_table <- track_features$find('{}', fields = '{"markets" : false}')
write.csv(
  track_features_table, 
  paste(getwd(), "../dataset/track_features_top_50.csv", sep="/"), 
  row.names = TRUE
)

track_features <- get_collection('track_features_top_10')
track_features_table <- track_features$find('{}', fields = '{"markets" : false}')
write.csv(
  track_features_table, 
  paste(getwd(), "../dataset/track_features_top_10.csv", sep="/"), 
  row.names = TRUE
)