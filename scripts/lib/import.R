library(pacman)
p_load(this.path)

import <- function(src_file_path) {
  path <- paste(this.path::this.dir(), '/', src_file_path, '.R', sep='')
  print(paste('Import', path, 'source file.'))
  source(path)
}