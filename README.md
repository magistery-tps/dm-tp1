# Datamining  - TP 1 - Preprocesamiento de datos

## Enlaces
*  [GDrive](https://drive.google.com/drive/folders/1gMuZizej1ZyM3l7MYInAvXubY6XkzXMp?usp=sharing)
*  [TP - Enunciado](https://github.com/mastery-tps/dm-tp1/blob/main/docs/enunciado-tp.pdf)


## Descargar repositorio

**Paso 1**: Instalar [git](https://git-scm.com/downloads).

**Paso 2**:  Ahora si  clonamos el repositorio.

```bash
$ git clone https://github.com/mastery-tps/dm-tp1.git
$ cd dm-tp1
```

## Importar dataset a mongodb

**Paso 1**: Desde la consola y parados en el dorectorio del proyecto cambiamos al directorio dataset

```bash
$ cd dataset
```

**Paso 2**: Descomprimimos el dataset:

```bash
$ unrar x spotify.part01.rar
```

**Paso 3**: Ahora cambiamos al nuevo directorio `spotify`:

```bash
$ cd spotify
```
**Paso 3**: Antes de segir en necesario tener instalado [mongodb](https://www.mongodb.com/try/download/community) y [mongodb-tools](https://www.mongodb.com/try/download/database-tools).

**Paso 4**: Importamos todas las colecciones en la base de datos:

```bash
$ mongoimport -d spotify -c track_features --file track_features.json --jsonArray
$ mongoimport -d spotify -c track_weekly_top_200 --file track_weekly_top_200.json --jsonArray
$ mongoimport -d spotify -c countries --file countries.json --jsonArray
```




