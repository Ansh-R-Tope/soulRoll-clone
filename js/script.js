let currentSong = new Audio();
let songs;
let currFolder;

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



async function getSongs(folder) {
    currFolder = folder;

    // fetch the song list from manifest.json
    let response = await fetch(`${folder}/love.json`);
    let data = await response.json();

    songs = data.songs;

    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";

    for (const song of songs) {
        songUl.innerHTML += `<li><img src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>Song Artist</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img  src="img/play button.svg" alt="">
            </div></li>`;
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}


const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}


async function displayAlbum() {
    // Fetch the albums.json file from songs folder
    let response = await fetch('songs/albums.json');
    if (!response.ok) {
        console.error("Failed to load albums.json");
        return;
    }
    let albums = await response.json();

    let cardCon = document.querySelector(".card-con");
    cardCon.innerHTML = "";  // Clear existing cards

    // Loop through each album object in albums.json
    for (const album of albums) {
        cardCon.innerHTML += `
            <div data-folder="${album.folder}" class="card">
                <div class="play">
                    <svg class="play-icon" width="30" height="30" viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="8" fill="#007BFF" />
                        <polygon points="6,5 11,8 6,11" fill="black" />
                    </svg>
                </div>
                <img src="songs/${album.folder}/${album.cover}" alt="${album.title} Cover">
                <h2>${album.title}</h2>
                <p>${album.description}</p>
            </div>
        `;
        console.log(`Adding album:`, album);
console.log(`Image path: songs/${album.folder}/${album.cover}`);

    }

    

    // Add click event listener to each card to load songs from that album
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async (event) => {
            let folder = card.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            playMusic(songs[0]);
        });
    });
}


// async function displayAlbum() {
//   let a = await fetch(`songs/`)

//     let response = await a.text()

//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardCon = document.querySelector(".card-con")


//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];


//         if (e.href.includes("/songs")) {
//             let folder = (e.href.split("/").slice(-2)[0]);
//             //get the meta data of folder
//             let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
//             let response = await a.json()

//             cardCon.innerHTML = cardCon.innerHTML + `<div data-folder="${folder}" class="card">
//                         <div class="play">
//                             <svg class="play-icon" width="30" height="30" viewBox="0 0 16 16"
//                                 xmlns="http://www.w3.org/2000/svg">
//                                 <circle cx="8" cy="8" r="8" fill="#007BFF" /> <!-- blue color -->
//                                 <polygon points="6,5 11,8 6,11" fill="black" />
//                             </svg>
//                         </div>
//                         <img src="songs/${folder}/cover.jpg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}!</p>
//                     </div>`
//         }
//     }


//     //load the playlist whenever card is clicked
//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//         e.addEventListener("click", async item => {

//             songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}`)
//             playMusic(songs[0])
//         })
//     })

// }

async function main() {


    // Getting list of songs
    await getSongs("songs/love")
    playMusic(songs[0], true)

    //display all albums on page
    displayAlbum()


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
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = parseInt(e.target.value) / 100

    })

    //add event listner to mute to volume
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })


}
main()





