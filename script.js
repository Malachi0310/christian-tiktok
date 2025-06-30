const API_KEY = 'AIzaSyDwrhYP7HU3_06rXJ9MoeSLR_Q-Oe-fSI4';

const SEARCH_TERMS = [
  'Apostle Joshua Selman',
  'Apostle Joshua Selman Singing Give Me Oil In My Lamp ',
  'Koinonia Worship',
  'Kathryn Kuhlman',
  'Apostle Babalola',
  'Nathaniel Bassey',
  'Gods Generals',
  'Myles Munroe'
];

const videoFeed = document.getElementById("videofeed");

// Pick random term to diversify results
function getRandomTerm() {
  return SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
}

// Create video card element
function createVideoCard(videoId, title) {
  const videoCard = document.createElement("div");
  videoCard.classList.add("video-card");

  videoCard.innerHTML = `
    <iframe
      loading="lazy"
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0"
      title="${title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
  return videoCard;
}

// Flag to prevent multiple simultaneous fetches
let isFetching = false;

// Fetch and append videos from random search term
function fetchAndAppendVideos() {
  if (isFetching) return;
  isFetching = true;

  const term = getRandomTerm();
  const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&videoEmbeddable=true&maxResults=3&order=viewCount&q=${encodeURIComponent(term)}&key=${API_KEY}`;

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      if (!data.items) return;
      data.items.forEach(item => {
        const videoId = item.id.videoId;
        if (!videoId) return;
        const card = createVideoCard(videoId, item.snippet.title);
        videoFeed.appendChild(card);
      });
    })
    .catch(err => console.error("Fetch error:", err))
    .finally(() => {
      isFetching = false;
    });
}

// Initial load
fetchAndAppendVideos();

// Listen for scroll near bottom of container to load more
videoFeed.addEventListener('scroll', () => {
  if (videoFeed.scrollTop + videoFeed.clientHeight >= videoFeed.scrollHeight - 150) {
    fetchAndAppendVideos();
  }
});
