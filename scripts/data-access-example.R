source('../lib/data-access.R')

track_weekly_top_200 <- get_collection('track_weekly_top_200')
track_features <- get_collection('track_features')
countries <- get_collection('countries')


track_features_table <- track_features$find('{}')
names(track_features_table)


query1 <- track_features_table %>%
  group_by(artist, album, number, name, key, mode, reproductions) %>%
  tally() %>%
  filter(n > 1) %>%
  arrange(desc(n))

View(query1)




query2 <- track_features_table %>%
  filter(artist == 'Eminem', album== 'Konvicted', name == 'Smack That')


View(query2)
