library(pacman)
p_load(stringi, tidyverse, modeest, WVPlots, DT, plotly, GGally)
options(warn=-1)


plot_hist <- function(
  values, 
  name, 
  xlab, 
  ylab = "Frecuencia",
  lwd = 3,
  legend_ = TRUE,
  missing_value = 0,
  truncated_mean_value=0.05
) {
  # Fill missing values...
  values[is.na(values)] <- missing_value
  
  # Plot histogram..
  hist(
    values, 
    col  = "deepskyblue", 
    main = sprintf("Distribución - %s", name), 
    xlab = name,
    ylab = ylab,
    freq = FALSE
  )
  
  # Plot measures of central tendency...
  lines(density(values),                         col = "chocolate3",      lwd = lwd)
  abline(v = mean(values),                       col = "black",           lwd = lwd)
  abline(v = mean(values, truncated_mean_value), col = "wheat3",          lwd = lwd)
  abline(v = median(values),                     col = "red",             lwd = lwd)
  abline(v = mfv(values),                        col = "blue",            lwd = lwd)
  abline(v = max(values),                        col = "darkolivegreen4", lwd = lwd)
  abline(v = min(values),                        col = "darkgoldenrod1",  lwd = lwd)
  
  # Plot legend...
  if (isTRUE(legend_)) {
    legend(
      x = "topright",
      c(
        "Densidad", "Media","Media Truncada", 
        "Mediana", "Moda", "Máximo", "Mínimo"
      ),
      col = c(
        "chocolate3", "black", "wheat3", "red", 
        "blue", "darkolivegreen4", "darkgoldenrod1"
      ),
      lwd = c(lwd, lwd, lwd, lwd, lwd, lwd, lwd),
      cex = 1
    )
  }
}


gplot_hist <- function(
  values,
  ylab = "Frecuencia",
  name = "",
  line_size=1.05,
  truncated_mean_value=0.05,
  binwidth=1,
  linetype="solid"
) {
  df = as.data.frame(values)

  p <- ggplot(df, aes(x=values)) +
    geom_histogram(aes(y=..density..), color="darkblue", fill="lightblue", binwidth=binwidth) +
    geom_density(alpha=0.2, size=line_size) +

    # Plot measures of central tendency...
    geom_vline(aes(xintercept = mean(values), color='Media'), linetype = linetype, size=line_size) +
    geom_vline(aes(xintercept = mean(values, truncated_mean_value), color='Media Truncada'), linetype=linetype, size=line_size) +
    geom_vline(aes(xintercept = median(values), color='Mediana'), linetype=linetype, size=line_size) +
    geom_vline(aes(xintercept = max(values), color='Máximo'), linetype=linetype, size=line_size) +
    geom_vline(aes(xintercept = min(values), color='Mínimo'), linetype=linetype, size=line_size)

  for(var in mfv(df$values)) {
      p <- p + geom_vline(aes(xintercept = var, color='Moda'), linetype=linetype, size=line_size)
  }
  
  p <- p + scale_color_manual(
    name = "Medidas de tendencia central", 
    values = c(
      'Media'   = "black", 
      'Media Truncada' = 'wheat3',
      'Mediana' = 'red',
      'Máximo'  = 'darkolivegreen4',
      'Mínimo'  = 'darkgoldenrod1',
      'Moda' = 'blue'
    )
  )
  
  p <- p + labs(x=name, y = ylab, title = paste("Histograma", name, sep=" - "))

  p
}

pie_plot <- function(data, title) {
  values = table(data)
  labels = paste(names(values), " (", values, ")", sep="")

  pie(values, labels = labels, main=title)  
}

ggpie_plot <- function(df, seg_label="", sum_label="") {
  p <- ggplot(df, aes(x="", y=Frequency, fill=Value)) +
    geom_bar(stat="identity", width=1, color="white") +
    coord_polar("y", start=0) +
    geom_text(
      aes(label = Frequency), 
      position = position_stack(vjust = 0.5), 
      color = "white"
    )+
    labs(
      x = NULL, 
      y = NULL, 
      fill = seg_label, 
      title = paste(sum_label, "por", seg_label, sep=" ")
    )  +
    theme_void()
  p
}

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
