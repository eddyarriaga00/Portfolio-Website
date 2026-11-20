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

const filters = document.querySelector('.filters');
const projects = document.querySelectorAll('[data-category]');
filters.hidden = false;
filters.addEventListener('click', event => {
    const selected = event.target.closest('button[data-filter]');
    if (!selected) return;

    for (const button of filters.querySelectorAll('button')) {
        button.setAttribute('aria-pressed', String(button === selected));
    }
    let count = 0;
    for (const project of projects) {
        project.hidden = selected.dataset.filter !== 'all' &&
            project.dataset.category !== selected.dataset.filter;
        if (!project.hidden) count++;
    }
    document.querySelector('#filter-status').textContent =
        count + (count === 1 ? ' project shown' : ' projects shown');
});
