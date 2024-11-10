document.addEventListener('DOMContentLoaded',()=>{

    const selectionContainer = document.querySelector('.selectionContainer');
    const grids = selectionContainer.querySelectorAll('.grid')

    const fishDefault = "assets/fish illustration-01.png"
    const fishHover = "assets/fish illustration-02.png"

    //adding fish in each grid
    for (let i = 0; i < 25; i++) {
        const fishGrid = document.createElement("div");
        fishGrid.classList.add("grid-item");

        const img = document.createElement("img")
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

});
