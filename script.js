document.addEventListener('DOMContentLoaded', async () => {
    // API link
    const baseURL = 'https://seanimal-recognizer-api.onrender.com';

    const selectionContainer = document.querySelector('.selectionContainer');
    const fishDefault = "assets/fish illustration-01.png";
    const fishHover = "assets/fish illustration-02.png";

    // Adding fish in each grid cell
    for (let i = 0; i < 25; i++) {
        const fishGrid = document.createElement("div");
        fishGrid.classList.add("grid-item");

        const img = document.createElement("img");
        img.src = fishDefault;

        fishGrid.appendChild(img);
        selectionContainer.appendChild(fishGrid);
    }

    // Adding fish illustration overlap (different opacity)
    const fishButtons = document.querySelectorAll(".buttons");

    fishButtons.forEach(button => {
        const buttonImg = document.createElement("img");
        buttonImg.src = fishDefault;
        button.appendChild(buttonImg);

        // Create a span element for hover text
        const hoverText = document.createElement("span");
        hoverText.classList.add("hover-text");

        button.addEventListener('mouseenter', () => {
            buttonImg.src = fishHover; // Change to hover image

            const topic = button.classList.contains('name') ? 'Name' : 
                          button.classList.contains('size') ? 'Size' : 
                          'Location';

            hoverText.innerHTML = `Sort by ${topic}`;
            button.appendChild(hoverText); // Add the hover text to the button
        });

        button.addEventListener('mouseleave', () => {
            buttonImg.src = fishDefault; // Change back to default image
            hoverText.innerHTML = ""; // Clear the hover text
        });
    });

    // Dropdown for fish names
    const listElement = document.querySelector('.list');
    let seaAnimals = [];

    // Fetch sea animal names and populate the dropdown
    const getNames = async () => {
        const response = await fetch(`${baseURL}/seaAnimals`);
        const data = await response.json();
        seaAnimals = data.seaAnimals; // Store data for later use

        const names = seaAnimals.map(animal => animal.name);
        names.forEach(name => {
            const newOption = document.createElement('option');
            newOption.value = name;
            newOption.textContent = name;
            listElement.appendChild(newOption);
        });
    };

    await getNames(); // Fetch names and populate dropdown

    // Display selected fish information
    listElement.addEventListener('change', async (event) => {
        const selectedFishName = event.target.value; 

        // Find selected fish data
        const selectedFish = seaAnimals.find(animal => animal.name === selectedFishName);
        if (!selectedFish) return;

        // Display fish details in designated elements
        document.getElementById('fish-name').textContent = selectedFish.name;
        document.getElementById('location').textContent = selectedFish.location;
        document.getElementById('color').textContent = selectedFish.color;
        document.getElementById('size').textContent = selectedFish.size;
        document.getElementById('shortDescription').textContent = selectedFish.shortDescription;
    });

    // Elements and state for showing/hiding selectCard
    const selectCard = document.querySelector('.selectCard');
    const selectCardSize = document.querySelector('.selectCardSize');
    const name = document.querySelector('.name');
    const size = document.querySelector('.size');
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    const done = document.querySelector('.done');
    const doneSize = document.querySelector('.done-size');
    const sizeDropdown = selectCardSize.querySelector('.listSize'); // Assuming size dropdown is in selectCardSize

    let isExpanded = false; // Track the toggle state

    // Button interaction - Name criteria
    name.addEventListener('click', () => {
        if (!isExpanded) {
            left.style.width = '55vw';
            right.style.width = '45vw';
            selectCard.classList.add('show');
        } else {
            left.style.width = '100vw';
            right.style.width = '0';
            selectCard.classList.remove('show');
        }
        isExpanded = !isExpanded; // Toggle state
    });

    // Button interaction - Size criteria
    size.addEventListener('click', async () => {
        if (!isExpanded) {
            left.style.width = '55vw';
            right.style.width = '45vw';
            selectCardSize.classList.add('show');
        } else {
            left.style.width = '100vw';
            right.style.width = '0';
            selectCardSize.classList.remove('show');
        }
        isExpanded = !isExpanded; // Toggle state

        const categorizedAnimals = await getSeaAnimalsAndCategorize();

        // Handle dropdown selection for small, medium, or large
        sizeDropdown.addEventListener('change', () => {
            const selectedSize = sizeDropdown.value;
            let animalsList;

            if (selectedSize === 'small') {
                animalsList = categorizedAnimals.small;
            } else if (selectedSize === 'medium') {
                animalsList = categorizedAnimals.medium;
            } else if (selectedSize === 'large') {
                animalsList = categorizedAnimals.large;
            } else {
                animalsList = [];
            }

            // Update the .right section with the list of animals
            right.innerHTML = `<h2>${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)}-Sized Animals</h2>`;
            animalsList.forEach(animal => {
                right.innerHTML += `<p>${animal.name}</p>`;
            });
        });
    });

    // Done button for selectCard
    done.addEventListener('click', () => {
        selectCard.classList.remove('show');
        left.style.width = '100vw'; // Reset left width when selectCard is hidden
        right.style.width = '0'; // Hide right section
        isExpanded = false; // Reset the toggle state

        // Clear displayed details
        document.getElementById('fish-name').textContent = " ";
        document.getElementById('location').textContent = "";
        document.getElementById('color').textContent = "";
        document.getElementById('size').textContent = "";
        document.getElementById('shortDescription').textContent = " "
    });

    // Done button for selectCardSize
    doneSize.addEventListener('click', () => {
        selectCardSize.classList.remove('show');
        left.style.width = '100vw'; // Reset left width when selectCardSize is hidden
        right.style.width = '0'; // Hide right section
        isExpanded = false; // Reset the toggle state

        right.innerHTML= " ";
    });

    // Function to categorize sea animals by size
    function categorizeBySize(seaAnimals) {
        const categories = {
            small: [],
            medium: [],
            large: []
        };

        seaAnimals.forEach(animal => {
            const sizeRange = animal.size.match(/\d+/g); // Extracts all numbers from size
            if (!sizeRange) return;

            const minSize = parseInt(sizeRange[0]);
            const maxSize = sizeRange.length > 1 ? parseInt(sizeRange[1]) : minSize;

            // Categorize based on range
            if (minSize < 50 || maxSize < 50) categories.small.push(animal);
            if ((minSize >= 50 && minSize <= 200) || (maxSize >= 50 && maxSize <= 200)) categories.medium.push(animal);
            if (minSize > 200 || maxSize > 200) categories.large.push(animal);
        });

        return categories;
    }

    // Fetch sea animal names and categorize by size
    const getSeaAnimalsAndCategorize = async () => {
        try {
            const response = await fetch(`${baseURL}/seaAnimals`);
            const data = await response.json();
            const seaAnimals = data.seaAnimals;

            // Categorize animals by size
            return categorizeBySize(seaAnimals);
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    };
});
