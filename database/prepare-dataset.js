
/*
    Importar datos en mongo:
    ------------------------

    1. Iniciamos mongodb:

    ❯ sudo systemctl start mongodb

    2. Chequeamos que este activo el servicio:

    ❯ sudo systemctl status mongodb
        ● mongodb.service - High-performance, schema-free document-oriented database
            Loaded: loaded (/usr/lib/systemd/system/mongodb.service; disabled; vendor preset: disabled)
            Active: active (running) since Thu 2021-04-22 19:00:16 -03; 1min 7s ago
        Main PID: 193129 (mongod)
            Tasks: 32 (limit: 19074)
            Memory: 201.4M
            CGroup: /system.slice/mongodb.service
                    └─193129 /usr/bin/mongod --quiet --config /etc/mongodb.conf

        abr 22 19:00:16 skynet systemd[1]: Started High-performance, schema-free document-oriented database.


    3. Importamos las colecciones:

    ❯ mongoimport -d spotify -c countries --file countries.json --jsonArray
*/
db.countries.createIndex({ 'code': 1 }, { unique: true, name: 'code_unique_index' });
/*
    ❯ mongoimport -d spotify -c charts --file charts-dm.json

    ❯ mongoimport -d spotify -c artist_audio_features --file artist_audio_features-dm.json

    4. Hacemos renaming de campos y quitamos campos que no necesitamos. Para esto creamos 2 vistas de las colecciones originales.
*/

db.charts.aggregate([
    {
        $project: {
            "position": "$Position",
            "track": "$Track_Name",
            "artist": "$Artist",
            /*
                Streams: Entiendo que es la cantidad total de reproducciones de un track.
            */
            "reproductions": "$Streams",
            "track_url": "$URL",
            "week_start": 1,
            "week_end": 1
        }
    },
    { $out: "track_weekly_top_200" }
]);


db.artist_audio_features_solo_art.aggregate([
    {
        $project: {
            "number": "$track_number",
            "name": "$track_name",
            "snd_preview": "$track_preview_url",
            "url": "$external_urls_spotify",
            "disc_number": 1,
            "album_id": 1,
            "album": "$album_name",
            "album_release_date": 1,
            "artist": "$artist_name",
            /* 
               Markets:
            */
            "markets": "$available_markets",
            /* 
               Danceability: Danceability describes how suitable a track is for dancing 
               based on a combination of musical elements including tempo, rhythm stability,
               beat strength, and overall regularity. A value of 0.0 is least danceable and
               1.0 is most danceable.
            */
            "danceability": 1,
            /* 
               Energy: Energy is a measure from 0.0 to 1.0 and represents a perceptual measure
               of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.
               For example, death metal has high energy, while a Bach prelude scores low on the
               scale. Perceptual features contributing to this attribute include dynamic range,
               perceived loudness, timbre, onset rate, and general entropy.
            */
            "energy": 1,
            /* 
               Loudness: The overall loudness of a track in decibels (dB). Loudness values are 
               averaged across the entire track and are useful for comparing relative loudness 
               of tracks. Loudness is the quality of a sound that is the primary psychological
               correlate of physical strength (amplitude). Values typical range between -60 and 0 db.
            */
            "loudness": 1,
            /* 
               Speechiness: Speechiness detects the presence of spoken words in a track. 
               The more exclusively speech-like the recording (e.g. talk show, audio book, 
                poetry), the closer to 1.0 the attribute value. Values above 0.66 describe 
                tracks that are probably made entirely of spoken words. Values between 0.33 
                and 0.66 describe tracks that may contain both music and speech, either in 
                sections or layered, including such cases as rap music. Values below 0.33 most 
                likely represent music and other non-speech-like tracks.
            */
            "speechiness": 1,
            /* 
               Acousticness: A confidence measure from 0.0 to 1.0 of whether the track
               is acoustic. 1.0 represents high confidence the track is acoustic.
            */
            "acousticness": 1,
            /* 
               Instrumentalness: Predicts whether a track contains no vocals. “Ooh” and “aah”
               sounds are treated as instrumental in this context. Rap or spoken word tracks
               are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater
               likelihood the track contains no vocal content. Values above 0.5 are intended to
               represent instrumental tracks, but confidence is higher as the value approaches 1.0.
            */
            "instrumentalness": 1,
            /* 
               Liveness: Detects the presence of an audience in the recording. Higher liveness
               values represent an increased probability that the track was performed live. 
               A value above 0.8 provides strong likelihood that the track is live.
            */
            "liveness": 1,
            /* 
               Valence: A measure from 0.0 to 1.0 describing the musical positiveness
               conveyed by a track. Tracks with high valence sound more positive
               (e.g. happy, cheerful, euphoric), while tracks with low valence
               sound more negative (e.g. sad, depressed, angry).
            */
            "valence": 1,
            /* 
               Explicit: Whether or not the track has explicit lyrics 
               ( true = yes it does; false = no it does not OR unknown).
            */
            "explicit": 1,
            /* 
               Tempo: The overall estimated tempo of a track in beats per minute (BPM). 
               In musical terminology, tempo is the speed or pace of a given piece and 
               derives directly from the average beat duration.
            */
            "tempo": 1,
            /* 
               Time Signature: An estimated overall time signature of a track. The time
               signature (meter) is a notational convention to specify how many beats
               are in each bar (or measure).
            */
            "time_signature": 1,
            /*
                Duration: The track length in milliseconds.
            */
            "duration_ms": 1,
            /* 
               Key: he key the track is in. Integers map to pitches using standard
               Pitch Class notation . E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on.
            */
            "key": "$key_name",
            /* 
               Mode: Mode indicates the modality (major or minor) of a track, the type of 
               scale from which its melodic content is derived. Major is represented 
               by 1 and minor is 0.
            */
            "mode": "$mode_name"
        }
    },
   { $out: "track_features" }
]);
db.track_features.createIndex({ "url": 1 });
/*

mongoexport -d spotify -c track_features --out track_features.json --jsonArray

mongoexport -d spotify -c track_weekly_top_200 --out track_weekly_top_200.json --jsonArray

*/


// Clave unica en track_features
db.track_features.aggregate([
   {
       "$group" : {
           _id : {
               artist:"$artist", 
               album_id:"$album_id", 
               album:"$album", 
               name:"$name"
           }
       }
   }
]);