library(pacman)
p_load(this.path, ggplot2)
source(paste(this.path::this.dir(), '/../lib/import.R', sep=''))

import('../lib/data-access')
import('../lib/data-frame')
import('../lib/plot')

gplot_hist_from_freq_table(
  get_freq_table('hist_top_10_danceability'), 
  name="Danceability", 
  binwidth=0.05
)
