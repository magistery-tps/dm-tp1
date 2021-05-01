//
//
//
// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------
db.createView(
    'track_weekly_top_200_2018',
    'track_weekly_top_200',
    [
        {
            $match: { week_start: { $gte: '2018-01-01'}, week_end: { $lte: '2018-12-31' } }
        }
    ]
);


db.createView(
    'track_weekly_top_200_2019',
    'track_weekly_top_200',
    [
        {
            $match: { week_start: { $gte: '2019-01-01'}, week_end: { $lte: '2019-12-31' } }
        }
    ]
);

db.createView(
    'artist_chats_avg',
    'track_weekly_top_200',
    [
        {
            $group: {
                _id: "$artist", 
                avg_position: { $avg: "$position" },
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
])

db.createView(
    'track_weekly_top_1',
    'track_weekly_top_200',
    [
        {
            $match: { "position": { $in: [1]} }
        }
    ]
);

db.createView(
    'track_weekly_top_10',
    'track_weekly_top_200',
    [
        {
            $match: { "position": { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9 , 10]} }
        }
    ]
);

db.createView(
    'track_weekly_top_5',
    'track_weekly_top_200',
    [
        {
            $match: { "position": { $in: [1, 2, 3, 4, 5]} }
        }
    ]
);
//
//
//
// ---------------------------------------------------------------------------
// Artists:
// ---------------------------------------------------------------------------
db.track_features.aggregate([
    { $group: { _id: "$artist" } },
    { $project: { _id: 0, name: "$_id" } },
    {$out: "artists"}
]);
db.artists.createIndex({ "name": 1 }, { unique: true });
//
//
//
// ---------------------------------------------------------------------------
// Tracks
// ---------------------------------------------------------------------------
db.track_features.aggregate([
    { $project: { artist: 1, name: 1, album: 1 } },
    {$out: "tracks"}
]);
db.tracks.createIndex({ "name": 1 }, { unique: true });
//
//
//
// ---------------------------------------------------------------------------
// Track features
// ---------------------------------------------------------------------------
db.createView(
    'track_real_features',
    'track_features',
    [
        {
            $project: {
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
                duration_ms : 1,
                explicit: 1,
                key: 1,
                mode: 1
            }
        } //, { $limit: 200 }
    ]
);

db.createView(
    'track_real_feature_200',
    'track_features',
    [
        { $limit: 200 }
    ]
);

// Join del top 1 con track features

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
            week_start:    {"$arrayElemAt": ["$charts.week_start", 0]},
            week_end:      {"$arrayElemAt": ["$charts.week_end", 0]},
            position:      {"$arrayElemAt": ["$charts.position", 0]},
            reproductions: {"$arrayElemAt": ["$charts.reproductions", 0]}
        }
    },
    {
        $match: { 
            week_start:     { $exists:  true },
            week_end:      { $exists:  true },
            position:      { $exists:  true },
            reproductions: { $exists:  true }
        }
    },
    {$out: "track_features:_top_1"}
])
