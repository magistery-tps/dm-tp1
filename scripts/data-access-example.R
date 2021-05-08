library(pacman)
p_load(this::path)
setwd(this.path::this.dir())
source('../lib/data-access.R')

track_features <- get_collection('track_features_top_200')
track_features_table <- track_features$find('{}', fields = '{"markets" : false}')
names(track_features_table)

track_features_table %>%
  group_by(week_start, artist, album, album_id, name) %>%
  tally() %>%
  filter(n > 1) %>%
  arrange(desc(n))