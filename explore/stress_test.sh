#!/bin/bash

prompts=(
    "infinite resolution"
    "infinite recursion"
    "infinite image quality"
    "infinite pixels"
    "a rainbow dragon in a purple healing pool of mustard"
    "a villain finding a rare tree on a lake"
    "two kids discovering an animal that does not exist"
    "too many ducks"
    "too many avengers"
    "DALL-E 2 painting DALL-E 2 on a cloud"
    "Shrek's script written in Klingon"
    "a mural of internet memes in an art museum"
    "a fifth-dimensional cube"
    "a fifth-dimensional cube made of mousepads"
    "nothing filled with particles"
    "a superhero holding a broken NFT"
    "earth reviving after human extinction, a new beginning, nature taking over buildings, animal kingdom, harmony, peace, earth balanced"
    "Freeform ferrofluids, beautiful dark chaos, swirling black frequency"
    "a home built in a huge Soap bubble, windows, doors, porches, awnings, middle of SPACE, cyberpunk lights, Hyper Detail, 8K, HD, Octane Rendering, Unreal Engine, V-Ray, full hd"
    "photo of an extremely cute alien fish swimming an alien habitable underwater planet, coral reefs, dream-like atmosphere, water, plants, peaceful, serenity, calm ocean, tansparent water, reefs, fish, coral, inner peace, awareness, silence, nature, evolution"
    "ossuary cemetary segmented shelves overgrown, graveyard, vertical shelves, zdzisław beksiński, hr giger, mystical occult symbol in real life, high detail, green fog"
    "Rubber Duck Aliens visiting the Earth for the first time, hyper-realistic, cinematic, detailed"
    "noir detective mr. Rubber Duck. Smoke, rain, moustache and bravery. He can solve any puzzle. But can't beat his inner demons. Expressive dark matte gouche painting."
    "Reunion of man, team, squad, cyberpunk, abstract, full hd render + 3d octane render +4k UHD + immense detail + dramatic lighting + well lit + black, purple, blue, pink, cerulean, teal, metallic colours, + fine details + octane render + 8k"
    "rubber duck duke ellington. Harlem jazz club. Singing. Mic. Ambience"
    "surreal blueish monk, dodecahedron for his head, amazing details, hyperrealistic photograph, octane made of billions of intricate small houses, GODLIKE, bokeh, photography on mars, cinematic lighting"
    "2 medieval warriors ::0.4 travelling on a cliff to a background castle , view of a coast line landscape , English coastline, Irish coastline, scottish coastline, perspective, folklore, King Arthur, Lord of the Rings, Game of Thrones. Photographic, Photography, photorealistic, concept art, Artstation trending , cinematic lighting, cinematic composition, rule of thirds , ultra-detailed, dusk sky , low contrast, natural lighting, fog, realistic, light fogged, detailed, atmosphere hyperrealistic , volumetric light, ultra photoreal, | 35mm| , Matte painting, movie concept art, hyper-detailed, insanely detailed, corona render, octane render"
    "viking north druid lich mermaid king wise old man god of death witch pagan face portrait, underwater, covered in runes, crown made of bones, necromancer, zdzisław beksiński, mikhail vrubel, hr giger, gustav klimt, symmetry, mystical occult symbol in real life, high detail, green light"
    "full body character + beautiful female neopunk wizard opening a portal to the sidereal multiverse :: Mandelbrot neuro web :: intricate galaxy inlay + ultra high detail, plasma neon internal glow, precise :: consciousness projection :: astral projection :: laser sharp, octane render + unreal render + photo real :: 8k, volumetric lighting high contrast"
    "Samhain figure, creature, wicca, occult, harvest, fall, hyper-realistic, ultra resolution, creepy, dark, witchcore"
    "a seamless tileable jade tree pattern, spiral carvings, octane renderer, trending on CGsociety"
    "hyerophant, god light, cinematic look, octane render, under water"
    "Sophia Loren in a heart shaped bath tub surrounded by rubber ducks:: hightly detailed, hyper realistic, photographic, wide angle lens:: in the style of Richard Avedon, Patrick Demarchelier, Vogue, Baron Adolphe De Meyer"
    "Reunion of man, team, squad, cyberpunk, abstract, full hd render + 3d octane render +4k UHD + immense detail + dramatic lighting + well lit + black, purple, blue, pink, cerulean, teal, metallic colours, + fine details + octane render + 8k"
    "modern kids play area landscape architecture, water play area, floating kids, seating areas, perspective view, rainy weather, biopunk, cinematic photo, highly detailed, cinematic lighting, ultra-detailed, ultrarealistic, photorealism, 8k, octane render"
    "Lovecraftian character Cthulhu, with the hunter hat, and the saw cleaver, with bloodborne weapons, full body, in the style bloodborne style, full body, dark fantasy, trending on ArtStation"
    "photorealistic flying house, many details, Ultra detailed, octane render, by Alexander Jansson"
    "Swirls :: fog :: phantom + ghost + dog + glowing eyes + bright silver ::3 smoke + shine + sphere:: black paper + elements + dark grey + dark blue + neon + baroque + rococo + white + ink + tarot card with ornate border frame + sébastien mitton, viktor antonov, sergey kolesov, detailed, intricate ink illustration + magic + glow"
    "full page technical drawing technocore mind meld evil-god symmetric::2 Hieroglyphic Occult::.5 esoterism hyper realistic, rendered, 8K, old, neon, vibrant fine details symmetric"
    "Wet chitinous texture, greasy"
    "tyriel archangel, king shamn , avatar , swords , angel wings . 4k , unreal engine"
    "ultra quality. hyper realistic smiling rubber duck with 4 wings, intricate silver, intricate brown and orange, neon armor, ornate, cinematic lighting, floral, symetric, portrait, statue cyberpunk, abstract, full hd render + 3d octane render +4k UHD + immense detail + dramatic lighting + well lit + black, purple, blue, pink, cerulean, teal, metallic colours, + fine details + octane render + 8k, abstract"
    "orange looking like water-universe-Earth in the background is a dusty wooden desk, room interior, realistic, abstract art, cinematic bright lighting, colorful, foggy, smokes"
    "dense woodland landscape, ::0.4 , English forest, Irish forest, scottish forest, perspective, folklore,King Arthur, Lord of the Rings, Game of Thrones. ultra photoreal , photographic, concept art, cinematic lighting, cinematic composition, rule of thirds , mysterious, eerie, cinematic lighting, ultra-detailed, ultrarealistic, photorealism, 8k, octane render, Albert Bierstadt"
    "arch demon, god, underworld, reclaim, throne, characters, wandering, showing off his power, decimating a large nation, Control, Controlling mass power, realistic, cinematic, high detail, hyper detailed, magic, copper, gold, black, red, green, purple, crimson, smoke, particles, Beam of light, necromancy, divination, supernatural powers, omen, hidden knowledge, event, foresee, foretell, fortold, art, fantasy, towering stature, grandiose, overpowering render, dark fantasy, unreal engine, raytracing, post-processing, zbrush, substance painter, trending on ArtStation, epic perspective, composition, photorealistic, vfx, cgsociety, volumetric lighting, + cinematic + photo + realism + high detail, cgi, 8k"
    "Portrait In the style of Rembrandt Harmenszoon van Rijn oil painting"
    "Tentacles + marble + ebony ::3 fog + smoke + shine + sphere:: black paper + elements + dark grey + dark purple + neon + baroque + rococo + white + ink + tarot card with ornate border frame + sébastien mitton, viktor antonov, sergey kolesov, detailed, intricate ink illustration + magic + glow"
    "devilcore cyberpunk vaporwave pixel diffusion, unholy geometry, radiating --stylize"
    "fibonacci, stone, snail, wallpaper, colorful, blue gray green, 3d pattern, 8k"
    "king shamn , avatar , swords , angel wings . 4k , unreal engine , wallpaper"
    "Kodak Portra 160 35mm photograph of 'rubber duck skeleton' aged, decayed, mossy 'in glass case'"
    "wicked man spending the night in the gaze of strange eyes, vintage, promiscuous, black and white, detailed, intricate ink, illustration, bittersweet, hd, surreal"
    "Stockholm city hall, but built in the medeival style, Photorealism, extreme detail, dusk, pink skies"
    "pale young man sitting in an armchair reading beside a big fireplace, bookshelves covering the dark walls, dogs lying on the floor, rule of thirds, dark room"
    "generative lines intricate but well defined linework lines running parralel to each other as they twist and turn to form a large geometric design that is almost symettrical but for a few glitchs and defects covering small portions of the image monochrome :: .01 thin purple lines on white wood"
    "A string structure, made of silver, enclosing a silicone translucent humanoïde creature ::195 large shot::75 panoramic ::75 black and white ::50 with a glimpse of red ::25 with a glimpse of green ::23 atmospheric ::22 intricate fine ornemental::80 cinematic ::80 hyper realism ::100 mono directional light::45 Caustics ::30 blade runner ::5 David Lynch inspiration ::4 Terry Gilliam inspiration ::8 Luis Bunuel inspiration ::11 Jean Jeunet inspiration ::9 crystalcore ::25 high detail ::100 octane redshift Lumion render 8k ::90 concept art ::1 hyper detailed, insane details, intricate ::22 elite, ornate, elegant, luxury, realist ::30 golden ratio ::75 octane render, weta digital, ray trace, 8k"
    "imagine unwashed unclean decrepid matterpattern"
    "hungarian parliament underwater-beach, palm trees behind, aerial shot, real photography, unreal-engine, 4k, highly detailed --wallpaper --uplight"
    "secret vintage photo of rubber duck commitng war crimes in World war 2, why is he did that"
    "pencil drawing of an insect, abstract, surrealism, hyper detail, line art"
    "in darkest blue subway,a side road of huge underground sewage channel"
    "city center public park, modern landscape architectural design for industrialpunk, water in the middle, dramatic lighting and composition, octane render, unreal engine 5, 8k"
    "gaelic forest spirit, qirin, god, deity, illustrated, detailed, serene"
    "victorian rocking toy carousel theme park horse, overgrown, zdzisław beksiński, hr giger, mystical occult symbol in real life, high detail, green fog"
    "generative lines intricate defined linework many fine line details with lines running parralel to each other as they twist and turn to form a large geometric design that is almost symettrical but for a few glitchs and defects covering small portions of the image monochrome :: .01 thin purple lines on white wood"
    "synthwave galaxy being eaten by Galactus, HDR, cinematic, ultrawide, realistic, highly detailed"
)

for i in ${!prompts[@]}; do
    echo "prompt $i: ${prompts[$i]}"

    curl 'http://localhost:8000/dalle' \
        -X 'OPTIONS' \
        -H 'Accept: */*' \
        -H 'Accept-Language: en-US,en;q=0.9,hu;q=0.8,ro;q=0.7' \
        -H 'Access-Control-Request-Headers: bypass-tunnel-reminder' \
        -H 'Access-Control-Request-Method: POST' \
        -H 'Connection: keep-alive' \
        -H 'Origin: http://localhost:3000' \
        -H 'Referer: http://localhost:3000/' \
        -H 'Sec-Fetch-Dest: empty' \
        -H 'Sec-Fetch-Mode: cors' \
        -H 'Sec-Fetch-Site: same-site' \
        -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.115 Safari/537.36' \
        --compressed \
        >/dev/null 2>&1

    curl 'http://localhost:8000/dalle' \
        -H 'Accept: */*' \
        -H 'Accept-Language: en-US,en;q=0.9,hu;q=0.8,ro;q=0.7' \
        -H 'Bypass-Tunnel-Reminder: go' \
        -H 'Connection: keep-alive' \
        -H 'Content-Type: text/plain;charset=UTF-8' \
        -H 'Origin: http://localhost:3000' \
        -H 'Referer: http://localhost:3000/' \
        -H 'Sec-Fetch-Dest: empty' \
        -H 'Sec-Fetch-Mode: cors' \
        -H 'Sec-Fetch-Site: same-site' \
        -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.115 Safari/537.36' \
        -H 'sec-ch-ua: "Chromium";v="104", " Not A;Brand";v="99"' \
        -H 'sec-ch-ua-mobile: ?0' \
        -H 'sec-ch-ua-platform: "Windows"' \
        --data-raw '{"text":"'"${prompts[$i]}"'"}' \
        --compressed \
        >/dev/null 2>&1

    free -h | sed -n 2p | awk '{print $3}'
    nvidia-smi --query-gpu=memory.used --format=csv | sed -n 2p

    sleep 25
    echo
done
