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
   let response = await fetch(`${folder}/album.json`);

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

    // //add event to volume
    // document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

    //     currentSong.volume = parseInt(e.target.value) / 100

    // })

    // //add event listner to mute to volume
    // document.querySelector(".volume>img").addEventListener("click", e => {
    //     if (e.target.src.includes("img/volume.svg")) {
    //         e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
    //         currentSong.volume = 0;
    //         document.querySelector(".range").getElementsByTagName("input")[0].value=0
    //     } else {
    //         e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
    //         currentSong.volume = .10;
    //         document.querySelector(".range").getElementsByTagName("input")[0].value=10
    //     }
    // })

    // Show search input when "Search" menu item is clicked
document.querySelector(".home ul li:nth-child(2)").addEventListener("click", () => {
    const searchContainer = document.querySelector(".search-container");
    searchContainer.style.display = "block";
    document.getElementById("searchInput").focus();
});

// Filter songs as user types
document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const listItems = document.querySelectorAll(".song-list ul li");

    listItems.forEach(li => {
        const songName = li.querySelector(".info div").textContent.toLowerCase();
        li.style.display = songName.includes(query) ? "flex" : "none";
    });
});



}
main()





