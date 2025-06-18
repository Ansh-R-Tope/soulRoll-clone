let currentSong = new Audio();
let songs;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00 : 00"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`

}



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

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {


    // Getting list of songs
    songs = await getSongs()
    playMusic(songs[0], true)

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
    btnplay.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/playbtn.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`
        const percent = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        document.querySelector(".progress").style.width = percent + "%";
    })

    // event lister to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        //  const per = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        const rect = document.querySelector(".seekbar").getBoundingClientRect(); // 👈 Always use .seekbar's box
        const clickX = e.clientX - rect.left;
        const per = (clickX / rect.width) * 100;
        document.querySelector(".circle").style.left = per + "%";
        document.querySelector(".progress").style.width = per + "%";
        currentSong.currentTime = (currentSong.duration) * per / 100
    })

    //addevent to hambugericon
    left = document.querySelector(".left")
    hamburger = document.querySelector(".hamburger")
    hamburger.addEventListener("click", () => {
        left.style.left = "0"
    })

    //addevent to close button
    document.querySelector(".close").addEventListener("click", () => {
        left.style.left = "-120%"
    })

    //add event listener to prev and next
    btnprev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    btnnext.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e);
        currentSong.volume=parseInt(e.target.value)/100
        
    })


}
main()





