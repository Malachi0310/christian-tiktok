const API_KEY = 'AIzaSyDwrhYP7HU3_06rXJ9MoeSLR_Q-Oe-fSI4';

const SEARCH_TERMS = [
  'Apostle Joshua Selman',
  'Apostle Joshua Selman Singing Give Me Oil In My Lamp ',
  'Koinonia Worship'
];

const videoFeed = document.getElementById("videofeed");
let isFetching = false;

// Store iframe video IDs to reset them for pausing
const videoCards = [];

// Pick random term
function getRandomTerm() {
  return SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
}

// Create video card
function createVideoCard(videoId, title) {
  const videoCard = document.createElement("div");
  videoCard.classList.add("video-card");

  videoCard.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=0&playsinline=1&rel=0"
      title="${title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;

  videoFeed.appendChild(videoCard);
  videoCards.push({ el: videoCard, id: videoId });
  observer.observe(videoCard); // Observe when added

  return videoCard;
}

// IntersectionObserver to control play/pause
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const iframe = entry.target.querySelector('iframe');
    const videoId = iframe.src.split("/embed/")[1]?.split("?")[0];

    if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
      // Play current video
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
    } else {
      // Pause by resetting src (kills autoplay)
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&playsinline=1&rel=0`;
    }
  });
}, {
  threshold: 0.75,
  root: videoFeed
});

// Fetch and append
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
        createVideoCard(videoId, item.snippet.title);
      });
    })
    .catch(err => console.error("Fetch error:", err))
    .finally(() => {
      isFetching = false;
    });
}

// Scroll listener
videoFeed.addEventListener('scroll', () => {
  if (videoFeed.scrollTop + videoFeed.clientHeight >= videoFeed.scrollHeight - 150) {
    fetchAndAppendVideos();
  }
});

// Load first batch
fetchAndAppendVideos();
