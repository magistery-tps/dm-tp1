library(pacman)
p_load(mongolite)

get_collection <- function(name, db="spotify") { 
  mongo(collection=name, db = db)
}