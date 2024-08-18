const originalUrlInput = document.getElementById('originalUrl');
const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');

shortenBtn.addEventListener('click', async () => {
    const originalUrl = originalUrlInput.value;
    if (!originalUrl) {
        resultDiv.textContent = 'Please enter a valid URL';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originalUrl })
        });

        const data = await response.json();
        if (response.ok) {
            resultDiv.textContent = `Short URL: ${data.shortUrl}`;
        } else {
            resultDiv.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        resultDiv.textContent = 'An error occurred';
        console.error(error);
    }
});
