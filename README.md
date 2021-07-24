# Datamining  - TP 1 - Preprocesamiento de datos

## Enlaces
* **TP**
    *  [Enunciado](https://github.com/mastery-tps/dm-tp1/blob/main/docs/enunciado-tp.pdf)
    *  [Informe](https://github.com/magistery-tps/dm-tp1/blob/main/docs/Data%20Mining%20-%20TP%20N%C2%B01%20-%20Grupo%205.pdf)
    *  [Preguntas](https://docs.google.com/document/d/1HvNfQMn5bhCcMa0JVHw9G9lG14zjBXNReRUnXjfSEh0/edit?usp=sharing)
    *  [GDrive](https://drive.google.com/drive/folders/1CxpEWQaq4qme6IQqG70N6eD2KVy7kMdt?usp=sharing)
* **Datos**
    *  [Descripción del dataset](https://github.com/magistery-tps/dm-tp1/blob/main/docs/descripcion-dataset.md)
    *  [Dataset Original](https://drive.google.com/drive/folders/1ym38Camd1k_cU7hF0XPi8Bbvt7LcroXd)

* **Herramientas**
    *  [Tutorial de GIT](https://youtu.be/kEPF-MWGq1w) ([Resumen](https://youtu.be/kEPF-MWGq1w?t=1031))
    *  [Mongolite User Manual](https://jeroen.github.io/mongolite/)

## Descargar repositorio

**Paso 1**: Instalar [git](https://git-scm.com/downloads).

**Paso 2**:  Ahora si  clonamos el repositorio.

```bash
$ git clone https://github.com/mastery-tps/dm-tp1.git
$ cd dm-tp1
```

## Importar dataset a mongodb

**Paso 1**: Desde la consola y parados en el directorio del proyecto, cambiamos al directorio `dataset`:

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
**Paso 3**: Antes de seguir es necesario tener instalado [mongodb](https://www.mongodb.com/try/download/community) y [mongodb-tools](https://www.mongodb.com/try/download/database-tools).

**Paso 4**: Importamos todas las colecciones en la base de datos:

```bash
$ mongoimport -d spotify -c artist_audio_features_solo_art  --file artist_audio_features_solo_art.json  --jsonArray
$ mongoimport -d spotify -c track_features                  --file track_features.json                  --jsonArray
$ mongoimport -d spotify -c track_weekly_top_200            --file track_weekly_top_200.json            --jsonArray
$ mongoimport -d spotify -c countries                       --file countries.json                       --jsonArray
$ mongoimport -d spotify -c lyrics-spanish  --file lyrics-spanish.json
$ mongoimport -d spotify -c lyrics-english  --file lyrics-english.json
```

## Vistas y nuevas colecciones

[Ver views.js](https://github.com/magistery-tps/dm-tp1/blob/main/database/views.js)

## Start/Stop MongoDB

### Linux:

```bash
$ sudo systemctl restart mongod
```

### MacOS

```bash
$ brew services start mongodb-community
$ brew services stop  mongodb-community
```
