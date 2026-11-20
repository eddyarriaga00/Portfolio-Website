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

const showcase = document.querySelector('.showcase');
const switcher = showcase.querySelector('.switcher');
const scene = showcase.querySelector('.scene');
const launch = showcase.querySelector('.launch');
const demo = document.querySelector('.demo-dialog');
const frameHost = demo.querySelector('.demo-frame');
const previews = {
    galaxy: ['Pocket Galaxy', 'A 3D star map of my projects and commits.', 'img/galaxy.webp', 'particle-mirror'],
    atlas: ['CS Course Atlas', 'Run code and explore algorithms in the browser.', 'img/atlas.jpg', 'CS-Course-Atlas'],
    basketball: ['Pocket Basketball', 'Start a career or jump into a quick game.', 'img/basketball.jpg', 'pocket-basketball']
};

switcher.hidden = false;
launch.hidden = false;
switcher.addEventListener('click', event => {
    const tab = event.target.closest('[data-preview]');
    if (!tab) return;
    const [title, description, image, path] = previews[tab.dataset.preview];
    for (const button of switcher.children) {
        button.setAttribute('aria-pressed', String(button === tab));
    }
    scene.querySelector('img').src = image;
    scene.querySelector('h2').textContent = title;
    scene.querySelector('p').textContent = description;
    scene.querySelector('a').href = 'https://eddyarriaga00.github.io/' + path + '/';
});

launch.addEventListener('click', () => {
    const title = scene.querySelector('h2').textContent;
    demo.querySelector('h2').textContent = title;
    const frame = document.createElement('iframe');
    frame.title = title;
    frame.src = scene.querySelector('a').href;
    frameHost.replaceChildren(frame);
    demo.showModal();
});
demo.querySelector('.close-demo').addEventListener('click', () => demo.close());
demo.addEventListener('close', () => frameHost.replaceChildren());
