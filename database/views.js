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

// Agrear uno identificador...
db.track_weekly_top_200.aggregate([
    {
        $addFields: { 
          identifier: { $concat: [ "$track", "$artist" ] } 
        }
    },
    { $out: "track_weekly_top_200" }
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
            reproductions:  { $last : "$reproductions" },
            track_url:      { $last : "$track_url" },
            track_artist:   { $last : "$track_artist" }
       }
    },
    { $project: { _id: 0 } },
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
             track_url:      { $last : "$track_url" },
             track_artist:   { $last : "$track_artist" }
        }
     },
    { $project: { _id: 0 } },
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
             track_url:      { $last : "$track_url" },
             track_artist:   { $last : "$track_artist" }
        }
    },
    { $project: { _id: 0 } },
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
             track_url:      { $last : "$track_url" },
             track_artist:   { $last : "$track_artist" }
        }
     },
    { $project: { _id: 0 } },
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
db.track_weekly_top_1.aggregate([
    {
      $lookup:
        {
          from: "track_features_unique",
          foreignField: "track_artist",
          localField: "track_artist", 
          as: "result"
        }
   },
   {
        $match: { 
            result: { $exists: true, $not: {$size: 0} } 
        }
   },
   {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,
            track_artist: 1,
            url:                { "$arrayElemAt": ["$result.url", 0] },
            name:               { "$arrayElemAt": ["$result.name", 0] },
            artist:             { "$arrayElemAt": ["$result.artist", 0] },
            album_id:           { "$arrayElemAt": ["$result.album_id", 0] },
            album:              { "$arrayElemAt": ["$result.album", 0] },
            number:             { "$arrayElemAt": ["$result.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$result.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$result.disc_number", 0] },
            markets:            { "$arrayElemAt": ["$result.markets", 0] },
            explicit:           { "$arrayElemAt": ["$result.explicit", 0] },
            key:                { "$arrayElemAt": ["$result.key", 0] },
            mode:               { "$arrayElemAt": ["$result.mode", 0] },

            album_release_date: { "$min": "$result.album_release_date"},
            danceability:       { "$avg": "$result.danceability" },
            energy:             { "$avg": "$result.energy" },
            loudness:           { "$avg": "$result.loudness" },
            speechiness:        { "$avg": "$result.speechiness" },
            acousticness:       { "$avg": "$result.acousticness" },
            instrumentalness:   { "$avg": "$result.instrumentalness" },
            liveness:           { "$avg": "$result.liveness" },
            valence:            { "$avg": "$result.valence"},
            tempo:              { "$avg": "$result.tempo" },
            time_signature:     { "$avg": "$result.time_signature" },
            duration_ms:        { "$avg": "$result.duration_ms" }
        }
    },
    { $out: "track_features_top_1" }
]);
db.track_features_top_1.createIndex({ "track_artist": 1 });
//
//
//
// Join del top 10 con track features
//
db.track_weekly_top_10.aggregate([
    {
      $lookup:
        {
          from: "track_features_unique",
          foreignField: "track_artist",
          localField: "track_artist", 
          as: "result"
        }
   },
   {
        $match: { 
            result: { $exists: true, $not: {$size: 0} } 
        }
   },
   {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,
            track_artist: 1,
            url:                { "$arrayElemAt": ["$result.url", 0] },
            name:               { "$arrayElemAt": ["$result.name", 0] },
            artist:             { "$arrayElemAt": ["$result.artist", 0] },
            album_id:           { "$arrayElemAt": ["$result.album_id", 0] },
            album:              { "$arrayElemAt": ["$result.album", 0] },
            number:             { "$arrayElemAt": ["$result.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$result.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$result.disc_number", 0] },
            markets:            { "$arrayElemAt": ["$result.markets", 0] },
            explicit:           { "$arrayElemAt": ["$result.explicit", 0] },
            key:                { "$arrayElemAt": ["$result.key", 0] },
            mode:               { "$arrayElemAt": ["$result.mode", 0] },

            album_release_date: { "$min": "$result.album_release_date"},
            danceability:       { "$avg": "$result.danceability" },
            energy:             { "$avg": "$result.energy" },
            loudness:           { "$avg": "$result.loudness" },
            speechiness:        { "$avg": "$result.speechiness" },
            acousticness:       { "$avg": "$result.acousticness" },
            instrumentalness:   { "$avg": "$result.instrumentalness" },
            liveness:           { "$avg": "$result.liveness" },
            valence:            { "$avg": "$result.valence"},
            tempo:              { "$avg": "$result.tempo" },
            time_signature:     { "$avg": "$result.time_signature" },
            duration_ms:        { "$avg": "$result.duration_ms" }
        }
    },
    { $out: "track_features_top_10" }
]);
db.track_features_top_10.createIndex({ "track_artist": 1 });
//
//
//
// Join del top 50 con track features
//
db.track_weekly_top_50.aggregate([
    {
        $lookup:
          {
            from: "track_features_unique",
            foreignField: "track_artist",
            localField: "track_artist", 
            as: "result"
          }
     },
     {
          $match: { 
              result: { $exists: true, $not: {$size: 0} } 
          }
     },
     {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,
            track_artist: 1,
            url:                { "$arrayElemAt": ["$result.url", 0] },
            name:               { "$arrayElemAt": ["$result.name", 0] },
            artist:             { "$arrayElemAt": ["$result.artist", 0] },
            album_id:           { "$arrayElemAt": ["$result.album_id", 0] },
            album:              { "$arrayElemAt": ["$result.album", 0] },
            number:             { "$arrayElemAt": ["$result.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$result.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$result.disc_number", 0] },
            markets:            { "$arrayElemAt": ["$result.markets", 0] },
            explicit:           { "$arrayElemAt": ["$result.explicit", 0] },
            key:                { "$arrayElemAt": ["$result.key", 0] },
            mode:               { "$arrayElemAt": ["$result.mode", 0] },

            album_release_date: { "$min": "$result.album_release_date"},
            danceability:       { "$avg": "$result.danceability" },
            energy:             { "$avg": "$result.energy" },
            loudness:           { "$avg": "$result.loudness" },
            speechiness:        { "$avg": "$result.speechiness" },
            acousticness:       { "$avg": "$result.acousticness" },
            instrumentalness:   { "$avg": "$result.instrumentalness" },
            liveness:           { "$avg": "$result.liveness" },
            valence:            { "$avg": "$result.valence"},
            tempo:              { "$avg": "$result.tempo" },
            time_signature:     { "$avg": "$result.time_signature" },
            duration_ms:        { "$avg": "$result.duration_ms" }
        }
    },
    { $out: "track_features_top_50" }
]);
db.track_features_top_50.createIndex({ "track_artist": 1 });
//
//
//
// Join del top 100 con track features
//
db.track_weekly_top_100.aggregate([
    {
        $lookup:
          {
            from: "track_features_unique",
            foreignField: "track_artist",
            localField: "track_artist", 
            as: "result"
          }
     },
     {
          $match: { 
              result: { $exists: true, $not: {$size: 0} } 
          }
     },
     {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,
            track_artist: 1,
            url:                { "$arrayElemAt": ["$result.url", 0] },
            name:               { "$arrayElemAt": ["$result.name", 0] },
            artist:             { "$arrayElemAt": ["$result.artist", 0] },
            album_id:           { "$arrayElemAt": ["$result.album_id", 0] },
            album:              { "$arrayElemAt": ["$result.album", 0] },
            number:             { "$arrayElemAt": ["$result.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$result.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$result.disc_number", 0] },
            markets:            { "$arrayElemAt": ["$result.markets", 0] },
            explicit:           { "$arrayElemAt": ["$result.explicit", 0] },
            key:                { "$arrayElemAt": ["$result.key", 0] },
            mode:               { "$arrayElemAt": ["$result.mode", 0] },

            album_release_date: { "$min": "$result.album_release_date"},
            danceability:       { "$avg": "$result.danceability" },
            energy:             { "$avg": "$result.energy" },
            loudness:           { "$avg": "$result.loudness" },
            speechiness:        { "$avg": "$result.speechiness" },
            acousticness:       { "$avg": "$result.acousticness" },
            instrumentalness:   { "$avg": "$result.instrumentalness" },
            liveness:           { "$avg": "$result.liveness" },
            valence:            { "$avg": "$result.valence"},
            tempo:              { "$avg": "$result.tempo" },
            time_signature:     { "$avg": "$result.time_signature" },
            duration_ms:        { "$avg": "$result.duration_ms" }
        }
    },
    { $out: "track_features_top_100" }
]);
db.track_features_top_100.createIndex({ "track_artist": 1 });
//
//
//
// Join del top 200 con track features
//
db.track_weekly_top_200.aggregate([
    {
        $lookup:
          {
            from: "track_features_unique",
            foreignField: "track_artist",
            localField: "track_artist", 
            as: "result"
          }
     },
     {
          $match: { 
              result: { $exists: true, $not: {$size: 0} } 
          }
     },
     {
        $project: {
            track_url: 1,
            week_start: 1,
            week_end: 1,
            position: 1,
            reproductions: 1,
            track_artist: 1,
            url:                { "$arrayElemAt": ["$result.url", 0] },
            name:               { "$arrayElemAt": ["$result.name", 0] },
            artist:             { "$arrayElemAt": ["$result.artist", 0] },
            album_id:           { "$arrayElemAt": ["$result.album_id", 0] },
            album:              { "$arrayElemAt": ["$result.album", 0] },
            number:             { "$arrayElemAt": ["$result.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$result.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$result.disc_number", 0] },
            markets:            { "$arrayElemAt": ["$result.markets", 0] },
            explicit:           { "$arrayElemAt": ["$result.explicit", 0] },
            key:                { "$arrayElemAt": ["$result.key", 0] },
            mode:               { "$arrayElemAt": ["$result.mode", 0] },

            album_release_date: { "$min": "$result.album_release_date"},
            danceability:       { "$avg": "$result.danceability" },
            energy:             { "$avg": "$result.energy" },
            loudness:           { "$avg": "$result.loudness" },
            speechiness:        { "$avg": "$result.speechiness" },
            acousticness:       { "$avg": "$result.acousticness" },
            instrumentalness:   { "$avg": "$result.instrumentalness" },
            liveness:           { "$avg": "$result.liveness" },
            valence:            { "$avg": "$result.valence"},
            tempo:              { "$avg": "$result.tempo" },
            time_signature:     { "$avg": "$result.time_signature" },
            duration_ms:        { "$avg": "$result.duration_ms" }
        }
    },
    { $out: "track_features_top_200" }
]);
db.track_features_top_200.createIndex({ "track_artist": 1 });
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
//
//
//
//
//
// ---------------------------------------------------------------------------
// Track features Agregated
// ---------------------------------------------------------------------------

// Busco todas la clase unicas...
db.getCollection('track_features').aggregate([
    { 
        $group: {
            _id: { identifier: "$identifier" },
            "count": { "$sum": 1}
        }
    },
    {
        $project: {
            _id: "$_id.identifier",
            count: 1
        }
    },
    { $out: "track_features_unique_keys" }
]);

// Hace join con track_features y devuelve un unico documento por cada clave unica...
db.track_features_unique_keys.aggregate([
    {
      $lookup:
        {
          from: "track_features",
          foreignField: "identifier",
          localField: "_id",
          as: "result"
        }
   },
   {
        $project: {
            _id:                { "$arrayElemAt": ["$result.identifier", 0] },
            name:               { "$arrayElemAt": ["$result.name", 0] },
            artist:             { "$arrayElemAt": ["$result.artist", 0] },
            album:              { "$arrayElemAt": ["$result.album", 0] },
            album_id:           { "$arrayElemAt": ["$result.album_id", 0] },
            url:                { "$arrayElemAt": ["$result.url", 0] },
            number:             { "$arrayElemAt": ["$result.number", 0] },
            snd_preview:        { "$arrayElemAt": ["$result.snd_preview", 0] },
            disc_number:        { "$arrayElemAt": ["$result.disc_number", 0] },
            album_release_date: { "$arrayElemAt": ["$result.album_release_date", 0] },
            markets:            { "$arrayElemAt": ["$result.markets", 0] },
            danceability:       { "$arrayElemAt": ["$result.danceability", 0] },
            energy:             { "$arrayElemAt": ["$result.energy", 0] },
            loudness:           { "$arrayElemAt": ["$result.loudness", 0] },
            speechiness:        { "$arrayElemAt": ["$result.speechiness", 0] },
            acousticness:       { "$arrayElemAt": ["$result.acousticness", 0] },
            instrumentalness:   { "$arrayElemAt": ["$result.instrumentalness", 0] },
            liveness:           { "$arrayElemAt": ["$result.liveness", 0] },
            valence:            { "$arrayElemAt": ["$result.valence", 0] },
            explicit:           { "$arrayElemAt": ["$result.explicit", 0] },
            tempo:              { "$arrayElemAt": ["$result.tempo", 0] },
            time_signature:     { "$arrayElemAt": ["$result.time_signature", 0] },
            duration_ms:        { "$arrayElemAt": ["$result.duration_ms", 0] },
            key:                { "$arrayElemAt": ["$result.key", 0] },
            mode:               { "$arrayElemAt": ["$result.mode", 0] }
        }
    },
    {
        $addFields: { 
          track_artist: { $concat: [ "$name", "$artist" ] } 
        }
    },
    { $out: "track_features_unique" }
]);
db.track_features_unique.createIndex({ "track_artist": 1 });


db.getCollection('track_features_unique').aggregate([
    { 
        $group: {
            _id: { track_artist: "$track_artist" },
            "count": { "$sum": 1}
        }
    },
    {
        $project: {
            _id: "$_id.track_artist",
            count: 1
        }
    },
    {
         $out: "track_features_unique_group_by_track_artist"   
    }
]);