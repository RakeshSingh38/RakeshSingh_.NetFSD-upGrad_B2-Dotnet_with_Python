const form = document.getElementById('form');
const msgBox = document.getElementById('msg-box');
const result = document.getElementById('result');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    result.innerHTML = `thank you <strong>${name}</strong>! your feedback has been received at <strong>${email}</strong> !`;
    
    form.classList.add('hidden');
    msgBox.classList.remove('hidden');
});
