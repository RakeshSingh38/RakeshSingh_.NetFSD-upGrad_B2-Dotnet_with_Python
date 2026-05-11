let db;

// open database with version 2 (users + images stores)
const request = indexedDB.open("UserDB", 2);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    console.log('Database is ready');

    // enable the file input now that the db is open
    const input = document.getElementById('fileInput');
    if (input) input.disabled = false;

    // add sample user (optional)
    addSampleUser();

    // show any stored images when we open
    displayImages();
};

function addSampleUser() {
    const trx = db.transaction('users', 'readwrite');
    const store = trx.objectStore('users');
    store.put({ id: 1, name: 'Rakesh Singh', age: 26 });
    trx.oncomplete = () => console.log('sample user added');
}

function saveImageBlob(blob) {
    const trx = db.transaction('images', 'readwrite');
    trx.objectStore('images').put({ image: blob });
    trx.oncomplete = displayImages;
    trx.onerror = e => console.error('store image error', e.target.error);
}

function displayImages() {
    const trx = db.transaction('images', 'readonly');
    const store = trx.objectStore('images');
    const req = store.getAll();
    req.onsuccess = (e) => {
        const imagesDiv = document.getElementById('images');
        imagesDiv.innerHTML = '';
        e.target.result.forEach(item => {
            const url = URL.createObjectURL(item.image);
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '200px';
            img.style.margin = '4px';
            imagesDiv.appendChild(img);
        });
    };
    req.onerror = e => console.error('read images error', e.target.error);
}

// UI wiring

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('fileInput');
    if (input) {
        input.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const blob = new Blob([ev.target.result], { type: file.type });
                saveImageBlob(blob);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    const showBtn = document.getElementById('showImages');
    if (showBtn) showBtn.addEventListener('click', displayImages);
});