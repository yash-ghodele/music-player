$images = @{
    "MidnightCity.jpg" = "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69"
    "BlindingLights.jpg" = "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452"
    "Levitating.jpg" = "https://i.scdn.co/image/ab67616d0000b2734c2fcea217ffb3832096f2d5"
    "SaveYourTears.jpg" = "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
    "Stay.jpg" = "https://i.scdn.co/image/ab67616d0000b273b0ed2da565de3d3e6f8e1f5a"
    "BadHabit.jpg" = "https://i.scdn.co/image/ab67616d0000b2734f1c3f4d1e1d6a1c0d7b0b0b"
    "HeatWaves.jpg" = "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea"
    "AsItWas.jpg" = "https://i.scdn.co/image/ab67616d0000b273b46f74097654d7f358994418"
    "RunningUpThatHill.jpg" = "https://i.scdn.co/image/ab67616d0000b27393427a177242d59ae6522c00"
    "GlimpseOfUs.jpg" = "https://i.scdn.co/image/ab67616d0000b2734676156f728c0358ee1a221f"
    "BreakMySoul.jpg" = "https://i.scdn.co/image/ab67616d0000b27329596639d675b8a011ed8370"
    "AboutDamnTime.jpg" = "https://i.scdn.co/image/ab67616d0000b273397d5194488b0f8540c49216"
    "fender_strat.jpg" = "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "roland_synth.jpg" = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "yamaha_drums.jpg" = "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "audiotechnica.jpg" = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "gibson_lespaul.jpg" = "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "shure_sm7b.jpg" = "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "korg_minilogue.jpg" = "https://images.unsplash.com/photo-1621617786422-965ba3d28646?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "martin_d28.jpg" = "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "pioneer_dj.jpg" = "https://images.unsplash.com/photo-1547012277-2fe654c600f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    "playlist_hits.jpg" = "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    "playlist_neon.jpg" = "https://images.unsplash.com/photo-1555620959-195c8fb8f001?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    "playlist_chill.jpg" = "https://images.unsplash.com/photo-1511671782779-c97d3d27a5d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    "playlist_workout.jpg" = "https://images.unsplash.com/photo-1534258936925-c48947385e24?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    "related_neon.jpg" = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100"
}

$destDir = "d:\Riya\Music Player\assets\images"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir }

foreach ($key in $images.Keys) {
    $url = $images[$key]
    $file = Join-Path $destDir $key
    echo "Downloading $key..."
    Invoke-WebRequest -Uri $url -OutFile $file
}
echo "Done."
