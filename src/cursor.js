export function initCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    const interactables = document.querySelectorAll('a, button, .project-card, .cert-card, .skill-tag');

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-hover');
        });
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-active');
        cursorDot.classList.add('cursor-active');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-active');
        cursorDot.classList.remove('cursor-active');
    });
}
