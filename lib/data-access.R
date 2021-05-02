library(pacman)
p_load(mongolite)

get_collection <- function(name, db="spotify") { 
  mongo(collection=name, db = db)
}

get_collection_fields <- function(collection_name, field_name) {
  collection <- get_collection(collection_name)
  projection <- paste('{ "', field_name, '": 1 }', sep='')
  collection$find(fields = projection)
}
