library(pacman)
p_load(this::path)
setwd(this.path::this.dir())
source('../lib/data-access.R')

track_features <- get_collection('track_features_top_200')
track_features_table <- track_features$find('{}', fields = "{ markets: false }")

write.csv(
  track_features_table, 
  paste(getwd(), "track_features_top_200.csv", sep="/"), 
  row.names = TRUE
)


names(track_features_table)

query1 <- track_features_table %>%
  group_by(week_start, artist, album, album_id, name) %>%
  tally() %>%
  filter(n > 1) %>%
  arrange(desc(n))

View(track_features_table)




query2 <- track_features_table %>%
  filter(artist == 'Eminem', album== 'Konvicted', name == 'Smack That')


View(query2)



