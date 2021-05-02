library(pacman)
p_load(stringi, tidyverse, WVPlots, DT, plotly, GGally)
options(warn=-1)

source('../lib/plot/hist.R')
source('../lib/plot/pie.R')

plot_heatmap <- function(data) {
  plot_ly(
    z = data, 
    y = colnames(data),
    x = rownames(data),
    colors = colorRamp(c("white", "red")),
    type = "heatmap"
  )
}

show_table <- function(table, page_size = 6, filter = 'top') {
  datatable(
    table, 
    rownames = FALSE, 
    filter=filter, 
    options = list(page_size = page_size, scrollX=T)
  )
}


box_plot <- function(data, horizontal = TRUE, xlab="", ylab="") {
  boxplot(
    data,
    xlab=xlab, 
    ylab=ylab,
    horizontal = horizontal,
    las=1,
    cex.lab=0.8, 
    cex.axis=0.6,
    pars=list(boxlwd = 2, boxwex=.8),
    col=colors()
  )
}
