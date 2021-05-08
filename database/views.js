// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------
db.createView(
    'artist_chats_avg',
    'track_weekly_top_200',
    [
        {
            $group: {
                _id: "$artist", 
                avg_position:       { $avg: "$position" },
                avg_reproductions:  { $avg: "$reproductions"},
            }
        },
        {
            $project: {
                _id: 0,
                artist: "$_id",
                avg_position: "$avg_position",
                avg_reproductions: "$avg_reproductions"
            }  
        }
    ]
);


db.track_weekly_top_200.aggregate([
    {$group: {_id: "$Artist", 
              avg_position: {$avg: "$Position"},
              avg_streams: {$avg: "$Streams"},
              }},
    {$project: {
          _id: 0,
          artist_name: "$_id",
          avg_position: "$avg_position",
          avg_streams: "$avg_streams"}  
        },
    {$out: "charts_avg"}
]);
//
//
//
// Top 1
//
db.track_weekly_top_200.aggregate([
    { $match: { position: { $lte: 1 } } },
    { 
       $group: {
           _id: { 
               position:      "$position",
               week_start:    "$week_start",
               week_end:      "$week_end",
               track:         "$track",
               artist:        "$artist",
               reproductions: "$reproductions"
           },
            position:       { $last : "$position" },
            week_start:     { $last : "$week_start" },
            week_end:       { $last : "$week_end" },
            track:          { $last : "$track" },
            artist:         { $last : "$artist" },
            reproductions:  { $last : "$reproductions" }
       }
    },
    { $out: "track_weekly_top_1" }
]);
// Este indice es necesario para el join ya el lookup hace buqueda aleatoria.
db.track_weekly_top_1.createIndex({ "artist": 1 });
//
//
//
// Top 10
//
db.track_weekly_top_200.aggregate([
    { $match: { position: {  $lte: 10 } } },
    { 
       $group: {
           _id: { 
               position:      "$position",
               week_start:    "$week_start",
               week_end:      "$week_end",
               track:         "$track",
               artist:        "$artist",
               reproductions: "$reproductions",
               track_url:     "$track_url"     
           },
            position:       { $last : "$position" },
            week_start:     { $last : "$week_start" },
            week_end:       { $last : "$week_end" },
            track:          { $last : "$track" },
            artist:         { $last : "$artist" },
            reproductions:  { $last : "$reproductions" },
            track_url:  { $last : "$track_url" }
       }
    },
    { $out: "track_weekly_top_10" }
]);
// Este indice es necesario para el join ya el lookup hace buqueda aleatoria.
db.track_weekly_top_10.createIndex({ "artist": 1 });
//
//
//
// Top 50
//
db.track_weekly_top_200.aggregate([
    { $match: { position: {  $lte: 50 } } },
    { 
       $group: {
           _id: { 
               position:      "$position",
               week_start:    "$week_start",
               week_end:      "$week_end",
               track:         "$track",
               artist:        "$artist",
               reproductions: "$reproductions",
               track_url:     "$track_url"     
           },
            position:       { $last : "$position" },
            week_start:     { $last : "$week_start" },
            week_end:       { $last : "$week_end" },
            track:          { $last : "$track" },
            artist:         { $last : "$artist" },
            reproductions:  { $last : "$reproductions" },
            track_url:  { $last : "$track_url" }
       }
    },
    { $out: "track_weekly_top_50" }
]);
// Este indice es necesario para el join ya el lookup hace buqueda aleatoria.
db.track_weekly_top_50.createIndex({ "artist": 1 });
//
//
//
// Top 100
//
db.track_weekly_top_200.aggregate([
    { $match: { position: {  $lte: 100 } } },
    { 
       $group: {
           _id: { 
               position:      "$position",
               week_start:    "$week_start",
               week_end:      "$week_end",
               track:         "$track",
               artist:        "$artist",
               reproductions: "$reproductions",
               track_url:     "$track_url"     
           },
            position:       { $last : "$position" },
            week_start:     { $last : "$week_start" },
            week_end:       { $last : "$week_end" },
            track:          { $last : "$track" },
            artist:         { $last : "$artist" },
            reproductions:  { $last : "$reproductions" },
            track_url:  { $last : "$track_url" }
       }
    },
    { $out: "track_weekly_top_100" }
]);
// Este indice es necesario para el join ya el lookup hace buqueda aleatoria.
db.track_weekly_top_100.createIndex({ "artist": 1 });
//
//
//
//
//
// ---------------------------------------------------------------------------
// Track features
// ---------------------------------------------------------------------------
// Indice (No unico) sobre la columns artist.
db.track_features.createIndex({ "artist": 1 });
//
//
//
// Join del top 10 con track features
//
db.track_weekly_top_10.aggregate([
    {
      $lookup:
        {
          from: "track_features",
          foreignField: "url",
          localField: "track_url", 
          as: "charts"
        }
   },
   {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,            

            url:                { "$arrayElemAt": ["$charts.url", 0] },
            name:               { "$arrayElemAt": ["$charts.name", 0] },
            artist:             { "$arrayElemAt": ["$charts.artist", 0] },
            album_id:           { "$arrayElemAt": ["$charts.album_id", 0] },
            album:              { "$arrayElemAt": ["$charts.album", 0] },
            number:             { "$arrayElemAt": ["$charts.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$charts.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$charts.disc_number", 0] },
            album_release_date: { "$arrayElemAt": ["$charts.album_release_date", 0] },
            markets:            { "$arrayElemAt": ["$charts.markets", 0] },
            danceability:       { "$arrayElemAt": ["$charts.danceability", 0] },
            energy:             { "$arrayElemAt": ["$charts.energy", 0] },
            loudness:           { "$arrayElemAt": ["$charts.loudness", 0] },
            speechiness:        { "$arrayElemAt": ["$charts.speechiness", 0] },
            acousticness:       { "$arrayElemAt": ["$charts.acousticness", 0] },
            instrumentalness:   { "$arrayElemAt": ["$charts.instrumentalness", 0] },
            liveness:           { "$arrayElemAt": ["$charts.liveness", 0] },
            valence:            { "$arrayElemAt": ["$charts.valence", 0] },
            explicit:           { "$arrayElemAt": ["$charts.explicit", 0] },
            tempo:              { "$arrayElemAt": ["$charts.tempo", 0] },
            time_signature:     { "$arrayElemAt": ["$charts.time_signature", 0] },
            duration_ms:        { "$arrayElemAt": ["$charts.duration_ms", 0] },
            key:                { "$arrayElemAt": ["$charts.key", 0] },
            mode:               { "$arrayElemAt": ["$charts.mode", 0] }
        }
    },
    { 
        $match: { 
            url: { $exists: true }
        }
    },
    { $out: "track_features_top_10" }
]);
//
//
//
// Join del top 50 con track features
//
db.track_weekly_top_50.aggregate([
    {
      $lookup:
        {
          from: "track_features",
          foreignField: "url",
          localField: "track_url", 
          as: "charts"
        }
   },
   {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,

            url:                { "$arrayElemAt": ["$charts.url", 0] },
            name:               { "$arrayElemAt": ["$charts.name", 0] },
            artist:             { "$arrayElemAt": ["$charts.artist", 0] },
            album_id:           { "$arrayElemAt": ["$charts.album_id", 0] },
            album:              { "$arrayElemAt": ["$charts.album", 0] },
            number:             { "$arrayElemAt": ["$charts.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$charts.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$charts.disc_number", 0] },
            album_release_date: { "$arrayElemAt": ["$charts.album_release_date", 0] },
            markets:            { "$arrayElemAt": ["$charts.markets", 0] },
            danceability:       { "$arrayElemAt": ["$charts.danceability", 0] },
            energy:             { "$arrayElemAt": ["$charts.energy", 0] },
            loudness:           { "$arrayElemAt": ["$charts.loudness", 0] },
            speechiness:        { "$arrayElemAt": ["$charts.speechiness", 0] },
            acousticness:       { "$arrayElemAt": ["$charts.acousticness", 0] },
            instrumentalness:   { "$arrayElemAt": ["$charts.instrumentalness", 0] },
            liveness:           { "$arrayElemAt": ["$charts.liveness", 0] },
            valence:            { "$arrayElemAt": ["$charts.valence", 0] },
            explicit:           { "$arrayElemAt": ["$charts.explicit", 0] },
            tempo:              { "$arrayElemAt": ["$charts.tempo", 0] },
            time_signature:     { "$arrayElemAt": ["$charts.time_signature", 0] },
            duration_ms:        { "$arrayElemAt": ["$charts.duration_ms", 0] },
            key:                { "$arrayElemAt": ["$charts.key", 0] },
            mode:               { "$arrayElemAt": ["$charts.mode", 0] }
        }
    },
    { 
        $match: { 
            url: { $exists: true }
        }
    },
    { $out: "track_features_top_50" }
]);
//
//
//
// Join del top 100 con track features
//
db.track_weekly_top_100.aggregate([
    {
      $lookup:
        {
          from: "track_features",
          foreignField: "url",
          localField: "track_url", 
          as: "charts"
        }
   },
   {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,            
            
            url:                { "$arrayElemAt": ["$charts.url", 0] },
            name:               { "$arrayElemAt": ["$charts.name", 0] },
            artist:             { "$arrayElemAt": ["$charts.artist", 0] },
            album_id:           { "$arrayElemAt": ["$charts.album_id", 0] },
            album:              { "$arrayElemAt": ["$charts.album", 0] },
            number:             { "$arrayElemAt": ["$charts.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$charts.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$charts.disc_number", 0] },
            album_release_date: { "$arrayElemAt": ["$charts.album_release_date", 0] },
            markets:            { "$arrayElemAt": ["$charts.markets", 0] },
            danceability:       { "$arrayElemAt": ["$charts.danceability", 0] },
            energy:             { "$arrayElemAt": ["$charts.energy", 0] },
            loudness:           { "$arrayElemAt": ["$charts.loudness", 0] },
            speechiness:        { "$arrayElemAt": ["$charts.speechiness", 0] },
            acousticness:       { "$arrayElemAt": ["$charts.acousticness", 0] },
            instrumentalness:   { "$arrayElemAt": ["$charts.instrumentalness", 0] },
            liveness:           { "$arrayElemAt": ["$charts.liveness", 0] },
            valence:            { "$arrayElemAt": ["$charts.valence", 0] },
            explicit:           { "$arrayElemAt": ["$charts.explicit", 0] },
            tempo:              { "$arrayElemAt": ["$charts.tempo", 0] },
            time_signature:     { "$arrayElemAt": ["$charts.time_signature", 0] },
            duration_ms:        { "$arrayElemAt": ["$charts.duration_ms", 0] },
            key:                { "$arrayElemAt": ["$charts.key", 0] },
            mode:               { "$arrayElemAt": ["$charts.mode", 0] }
        }
    },
    { 
        $match: { 
            url: { $exists: true }
        }
    },
    { $out: "track_features_top_100" }
]);
//
//
//
// Join del top 200 con track features
//
db.track_weekly_top_200.aggregate([
    {
      $lookup:
        {
          from: "track_features",
          foreignField: "url",
          localField: "track_url", 
          as: "charts"
        }
   },
   {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,            

            url:                { "$arrayElemAt": ["$charts.url", 0] },
            name:               { "$arrayElemAt": ["$charts.name", 0] },
            artist:             { "$arrayElemAt": ["$charts.artist", 0] },
            album_id:           { "$arrayElemAt": ["$charts.album_id", 0] },
            album:              { "$arrayElemAt": ["$charts.album", 0] },
            number:             { "$arrayElemAt": ["$charts.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$charts.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$charts.disc_number", 0] },
            album_release_date: { "$arrayElemAt": ["$charts.album_release_date", 0] },
            markets:            { "$arrayElemAt": ["$charts.markets", 0] },
            danceability:       { "$arrayElemAt": ["$charts.danceability", 0] },
            energy:             { "$arrayElemAt": ["$charts.energy", 0] },
            loudness:           { "$arrayElemAt": ["$charts.loudness", 0] },
            speechiness:        { "$arrayElemAt": ["$charts.speechiness", 0] },
            acousticness:       { "$arrayElemAt": ["$charts.acousticness", 0] },
            instrumentalness:   { "$arrayElemAt": ["$charts.instrumentalness", 0] },
            liveness:           { "$arrayElemAt": ["$charts.liveness", 0] },
            valence:            { "$arrayElemAt": ["$charts.valence", 0] },
            explicit:           { "$arrayElemAt": ["$charts.explicit", 0] },
            tempo:              { "$arrayElemAt": ["$charts.tempo", 0] },
            time_signature:     { "$arrayElemAt": ["$charts.time_signature", 0] },
            duration_ms:        { "$arrayElemAt": ["$charts.duration_ms", 0] },
            key:                { "$arrayElemAt": ["$charts.key", 0] },
            mode:               { "$arrayElemAt": ["$charts.mode", 0] }
        }
    },
    { 
        $match: { 
            url: { $exists: true }
        }
    },
    { $out: "track_features_top_200" }
]);
//
//
//
// Solo features numericos para analizar correlacion
//
db.track_features_top_200.aggregate([
   {
        $project: {
            name: 1,
            danceability: 1, 
            energy: 1,
            loudness: 1,
            speechiness: 1,
            acousticness: 1,
            instrumentalness: 1,
            liveness: 1,
            valence: 1,
            tempo: 1,
            time_signature: 1,
            duration_ms: 1,
            position: 1,
            reproductions: 1
        }
    },
    { $out: "track_features_top_200_num" }
]);
//
//
//
db.track_features_top_100.aggregate([
    {
         $project: {
             name: 1,
             danceability: 1, 
             energy: 1,
             loudness: 1,
             speechiness: 1,
             acousticness: 1,
             instrumentalness: 1,
             liveness: 1,
             valence: 1,
             tempo: 1,
             time_signature: 1,
             duration_ms: 1,
             position: 1,
             reproductions: 1
         }
     },
     { $out: "track_features_top_100_num" }
 ]);