let currentSong = new Audio();

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

const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src="/songs/" + track
    currentSong.play()
    play.src="img/pause.svg"
}


async function main() {


    // Getting list of songs
    let songs = await getSongs()


    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  src="/img/play button.svg" alt="">
                            </div></li>`
    }

    // applying event listener to every song

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    //attach event listener to buttons
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="img/playbtn.svg"
        }
    })

}
main()
