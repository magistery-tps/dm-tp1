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


// Top 1 sin duplicados (157)
db.track_weekly_top_200.aggregate([
    { $match: { "position": { $in: [1]} } },
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


// Top 10 sin duplicados (1570)
db.track_weekly_top_200.aggregate([
    { $match: { "position": { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} } },
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
    { $out: "track_weekly_top_10" }
]);
// Este indice es necesario para el join ya el lookup hace buqueda aleatoria.
db.track_weekly_top_10.createIndex({ "artist": 1 });
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

// Join del top 1 con track features (5251)
db.track_features.aggregate([
    {
      $lookup:
        {
          from: "track_weekly_top_1",
          foreignField: "track",
          localField: "name", 
          as: "charts"
        }
   },
   {
        $project: {
            artist: 1,
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
            track:         { "$arrayElemAt": ["$charts.track", 0] },
            artist2:       { "$arrayElemAt": ["$charts.artist", 0] },
            week_start:    { "$arrayElemAt": ["$charts.week_start", 0] },
            week_end:      { "$arrayElemAt": ["$charts.week_end", 0] },
            position:      { "$arrayElemAt": ["$charts.position", 0] },
            reproductions: { "$arrayElemAt": ["$charts.reproductions", 0] }
        }
    },
    {
        $match: { 
            week_start:    { $exists:  true },
            week_end:      { $exists:  true },
            position:      { $exists:  true },
            reproductions: { $exists:  true },
            $expr:         { $eq: ["$artist", "$artist2"] },
            $expr:         { $eq: ["$name", "$track"] }
        }
    },
    { $project: { name: 0, artist2: 0 } },
    {$out: "track_features_top_1"}
]);



// Join del top 10 con track features (33017)
db.track_features.aggregate([
    {
      $lookup:
        {
          from: "track_weekly_top_10",
          foreignField: "track",
          localField: "name", 
          as: "charts"
        }
   },
   {
        $project: {
            artist: 1,
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
            track:         { "$arrayElemAt": ["$charts.track", 0] },
            artist2:       { "$arrayElemAt": ["$charts.artist", 0] },
            week_start:    { "$arrayElemAt": ["$charts.week_start", 0] },
            week_end:      { "$arrayElemAt": ["$charts.week_end", 0] },
            position:      { "$arrayElemAt": ["$charts.position", 0] },
            reproductions: { "$arrayElemAt": ["$charts.reproductions", 0] }
        }
    },
    {
        $match: { 
            week_start:    { $exists:  true },
            week_end:      { $exists:  true },
            position:      { $exists:  true },
            reproductions: { $exists:  true },
            $expr:         { $eq: ["$artist", "$artist2"] },
            $expr:         { $eq: ["$name", "$track"] }
        }
    },
    { $project: { name: 0, artist2: 0 } },
    { $out: "track_features_top_10" }
]);


// Histograma de danceability
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$danceability", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_danceability_hist" }
]);

// Histograma de energy
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$energy", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_energy_hist" }
]);

// Histograma de loudness
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$loudness", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_loudness_hist" }
]);

// Histograma de speechiness
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$speechiness", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_speechiness_hist" }
]);

// Histograma de acousticness
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$acousticness", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_acousticness_hist" }
]);

// Histograma de instrumentalness
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$instrumentalness", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_instrumentalness_hist" }
]);

// Histograma de liveness
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$liveness", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_liveness_hist" }
]);

// Histograma de valence
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$valence", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_valence_hist" }
]);

// Histograma de tempo
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$tempo", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_tempo_hist" }
]);


// Histograma de duration_ms
db.track_features_top_10.aggregate([
    { $bucketAuto: { groupBy: "$duration_ms", buckets: 30000 } },
    { $project: { min:  "$_id.min", max:  "$_id.max", frequence:  "$count" } },
    { $out: "top_10_duration_ms_hist" }
]);
