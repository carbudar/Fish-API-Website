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
            buttonImg.src = fishHover;

            const topic = button.classList.contains('name') ? 'Name' : 
                          button.classList.contains('size') ? 'Size' : 
                          'Location';

            hoverText.innerHTML = `Sort by ${topic}`;
            hoverText.style.color='rgb(244,203,30)'
            hoverText.style.fontSize = '1.5rem'
            button.appendChild(hoverText);
        });

        button.addEventListener('mouseleave', () => {
            buttonImg.src = fishDefault;
            hoverText.innerHTML = "";
        });
    });

    // Dropdown for fish names
    const listElement = document.querySelector('.list');
    let seaAnimals = [];

    // Fetch sea animal names and populate the dropdown
    const getNames = async () => {
        const response = await fetch(`${baseURL}/seaAnimals`);
        const data = await response.json();
        seaAnimals = data.seaAnimals;

        const names = seaAnimals.map(animal => animal.name);
        names.forEach(name => {
            const newOption = document.createElement('option');
            newOption.value = name;
            newOption.textContent = name;
            listElement.appendChild(newOption);
        });
    };

    await getNames();

    // Display selected fish information
listElement.addEventListener('change', (event) => {
    const selectedFishName = event.target.value;
    const selectedFish = seaAnimals.find(animal => animal.name === selectedFishName);
    if (!selectedFish) return;

    // Update the innerHTML of animal-info with the selected fish details
    const animalInfoDiv = document.getElementById('animal-info');
    right.innerHTML = `
        <h2>${selectedFish.name}</h2>
        <p><b>Location:</b> ${selectedFish.location}</p>
        <p><b>Color:</b> ${selectedFish.color}</p>
        <p><b>Size:</b> ${selectedFish.size}</p>
        <p><b>Description:</b> ${selectedFish.shortDescription}</p>
    `;
});

//variables
    const selectCard = document.querySelector('.selectCard');
    const selectCardSize = document.querySelector('.selectCardSize');
    const selectCardLoc = document.querySelector('.selectCardLoc');
    const name = document.querySelector('.name');
    const size = document.querySelector('.size');
    const location = document.querySelector('.location');
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    const done = document.querySelector('.done');
    const doneSize = document.querySelector('.done-size');
    const doneLoc = document.querySelector('.done-Loc');
    const sizeDropdown = selectCardSize.querySelector('.listSize');
    const listLocation = document.querySelector('.listLoc');
    let isExpanded = false;

    // Button interaction - Name criteria
    name.addEventListener('click', () => {
        if (!isExpanded) {
            left.style.width = '60vw';
            right.style.width = '40vw';
            selectCard.classList.add('show');
        } else {
            left.style.width = '100vw';
            right.style.width = '0';
            selectCard.classList.remove('show');
        }
        isExpanded = !isExpanded;
    });

    // Button interaction - Size criteria
    size.addEventListener('click', async () => {
        if (!isExpanded) {
            left.style.width = '60vw';
            right.style.width = '40vw';
            selectCardSize.classList.add('show');
        } else {
            left.style.width = '100vw';
            right.style.width = '0';
            selectCardSize.classList.remove('show');
        }
        isExpanded = !isExpanded;

        const categorizedAnimals = await getSeaAnimalsAndCategorize();

        //based on what category is selected, show the list of that category
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

            right.innerHTML = `<h2>${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)}-Sized Animals</h2>`;
            animalsList.forEach(animal => {
                right.innerHTML += `<p>${animal.name}</p>`;
            });
        });
    });

    // Function to categorize sea animals by size
    function categorizeBySize(seaAnimals) {
        const categories = { small: [], medium: [], large: [] };
        seaAnimals.forEach(animal => {
            const sizeRange = animal.size.match(/\d+/g); //group numbers by string to get the range from json
            if (!sizeRange) return;

            //group numbers as range of small, medium, large
            const minSize = parseInt(sizeRange[0]);
            const maxSize = sizeRange.length > 1 ? parseInt(sizeRange[1]) : minSize;

            if (minSize < 50 || maxSize < 50) categories.small.push(animal);
            if ((minSize >= 50 && minSize <= 200) || (maxSize >= 50 && maxSize <= 200)) categories.medium.push(animal);
            if (minSize > 200 || maxSize > 200) categories.large.push(animal);
        });

        return categories;
    }

    // Fetch and categorize sea animals by size
    const getSeaAnimalsAndCategorize = async () => {
        try {
            const response = await fetch(`${baseURL}/seaAnimals`);
            const data = await response.json();
            return categorizeBySize(data.seaAnimals);
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    };

    // Button interaction - Location criteria
    location.addEventListener('click', () => {
        if (!isExpanded) {
            left.style.width = '60vw';
            right.style.width = '40vw';
            selectCardLoc.classList.add('show');
        } else {
            left.style.width = '100vw';
            right.style.width = '0';
            selectCardLoc.classList.remove('show');
        }
        isExpanded = !isExpanded;
    });

    // Done button for selectCard
    done.addEventListener('click', () => {
        selectCard.classList.remove('show');
        left.style.width = '100vw';
        right.style.width = '0';
        isExpanded = false;

        right.innerHTML = " "
    });

    // Done button for selectCardSize
    doneSize.addEventListener('click', () => {
        selectCardSize.classList.remove('show');
        left.style.width = '100vw';
        right.style.width = '0';
        isExpanded = false;
        right.innerHTML = " ";
    });

    // Done button for selectCardLoc
    doneLoc.addEventListener('click', () => {
        selectCardLoc.classList.remove('show');
        left.style.width = '100vw';
        right.style.width = '0';
        isExpanded = false;

        right.innerHTML = " ";
    });

    // Fetch sea animal locations and populate the dropdown
    let locations = [];
    const getLocation = async () => {
        const response = await fetch(`${baseURL}/seaAnimals`);
        const data = await response.json();
        locations = data.seaAnimals;


        //use the list of location to put into the option drop down
        const fishLoc = [...new Set(locations.map(animal => animal.location))];
        fishLoc.forEach(animalLocation => {
            const newOption = document.createElement('option');
            newOption.value = animalLocation;
            newOption.textContent = animalLocation;
            listLocation.appendChild(newOption);
        });
    };

    await getLocation();

    // Event listener for location dropdown
    listLocation.addEventListener('change', () => {
        const selectedLocation = listLocation.value;
        const animalsByLocation = locations.filter(animal => animal.location === selectedLocation);

        right.innerHTML = `<h2>Animals in ${selectedLocation}</h2>`;
        animalsByLocation.forEach(animal => {
            right.innerHTML += `<p>${animal.name}</p>`;
        });
    });
    right.style.color = 'rgb(47,81,132)'

});
