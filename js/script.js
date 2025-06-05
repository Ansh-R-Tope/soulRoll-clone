

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs

}

async function main() {
    let songs = await getSongs()
    console.log(songs);

    let songUl=document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+`<li>
        
    
                            <img src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  src="/img/play button.svg" alt="">
                            </div>

                        
        
        
        
        
        </li>`
    }

    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata",()=>{
        let duration=audio.duration
        console.log(duration);
        
    })

}
main()
