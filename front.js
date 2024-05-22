setInterval(() => {
    const container = document.querySelector('picture');
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = '/state.jpg';
    container.append(img)
}, 5000)