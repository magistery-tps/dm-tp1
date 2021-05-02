library(pacman)
p_load(this.path, ggplot2)
source(paste(this.path::this.dir(), '/../lib/import.R', sep=''))

import('../lib/data-access')
import('../lib/data-frame')
import('../lib/plot')

danceability_table <- get_freq_table('hist_top_10_danceability')

names(danceability_table)

freq_table_mean(danceability_table)

ggplot(danceability_table, aes(x=factor(value), y=frequency)) +
  geom_col(color='blue') +
  ylab('Frequency') +
  xlab('Danceability')

gplot_hist_from_freq_table(danceability_table, "Danceability", binwidth=0.05)
