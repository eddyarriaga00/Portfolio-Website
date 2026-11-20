const track = document.querySelector('#track');
const player = document.querySelector('.music audio');

track.addEventListener('change', () => {
    const wasPlaying = !player.paused;
    player.src = track.value;

    if (wasPlaying) {
        player.play().catch(() => {
            // The native controls can retry playback.
        });
    }
});
