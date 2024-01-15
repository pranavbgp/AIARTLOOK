const apiKey = "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";

const maxImages = 12; // Number of images to generate for each prompt
let selectedImageNumber = null;

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to disable the generate button during processing
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// Function to enable the generate button after process
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}


// Function to clear image grid
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Function to generate images
async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        // Generate a random number between 1 and 10000 and append it to the prompt
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        // We added random number to prompt to create different results
        const response = await fetch(
            "https://api-inference.huggingface.co/models/dreamlike-art/dreamlike-photoreal-2.0",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // Reset selected image number
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    // Create the modal
    const modal = document.createElement("div");
    modal.className = "modal";
    
    // Show a confirmation message within the modal
    const confirmationMessage = document.createElement("p");
    confirmationMessage.innerText = "Do you want to download the image?";
    modal.appendChild(confirmationMessage);

    // Add "Download" and "Cancel" buttons
    const downloadButton = document.createElement("button");
    downloadButton.innerText = "Download";
    downloadButton.addEventListener("click", function() {
        download(imgUrl, imageNumber); // Call the download function
        showStatusMessage(modal, "Download successful ✅");
        setTimeout(function() {
            modal.style.display = "none";
        },2000); // Show success message
    });
    modal.appendChild(downloadButton);

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", function() {
        modal.style.display = "1"; // Close the modal
        showStatusMessage(modal, "Download cancelled ❌");
        setTimeout(function() {
            modal.style.display = "none";
        }, 2000); // Show cancellation message
    });
    modal.appendChild(cancelButton);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Display the modal
    modal.style.display = "block";
}

// Function to handle the actual download
function download(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}

// Function to show status messages within the modal
function showStatusMessage(modal, message) {
    // Clear existing messages
    modal.innerHTML = "";

    const statusMessage = document.createElement("p");
    statusMessage.innerText = message;
    modal.appendChild(statusMessage);
}

document.getElementById("generate").addEventListener("click", function() {
    // Display the loading GIF
    document.getElementById("loading").style.display = "block";

    // Simulate search process (you can add your search logic here)

    // For demonstration purposes, let's simulate a delay of 2 seconds before hiding the loading GIF
    setTimeout(function() {
        // Hide the loading GIF after a delay (simulating search completion)
        document.getElementById("loading").style.display = "none";

        // Display search results (you can implement this based on your actual search logic)
        displaySearchResults(); // Implement this function to show search results
    }, 2000); // 2000 milliseconds (2 seconds) delay for demonstration, replace this with your actual search process
});

// Select the elements
const generateButton = document.getElementById("generate");
const photoCollage = document.querySelector(".photo-collage");

// Function to hide photo-collage
function hidePhotoCollage() {
    photoCollage.style.display = "none";
}

// Event listener for the search button click
generateButton.addEventListener("click", () => {
    // Hide photo-collage on search button click
    hidePhotoCollage();
    
    // Perform search operation
    // ...
});

// Check localStorage for the state of photo-collage on page load
window.addEventListener("load", () => {
    const isPhotoCollageHidden = localStorage.getItem("photoCollageHidden");

    if (isPhotoCollageHidden === "true") {
        // If photo-collage was hidden, hide it
        hidePhotoCollage();
    }
});

// Save photo-collage state to localStorage on page refresh
window.addEventListener("beforeunload", () => {
    localStorage.setItem("photoCollageHidden", photoCollage.style.display ==="display");
});