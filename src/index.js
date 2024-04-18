let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");
  const baseUrl = "http://localhost:3000/toys";

  // Toggle form display
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display all toys from the API
  function fetchToys() {
    fetch(baseUrl)
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      });
  }

  // Create a toy card
  function renderToy(toy) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="like-${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(div);

    const likeBtn = div.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => increaseLikes(toy));
  }

  // Handle form submission to add a new toy
  toyForm.addEventListener("submit", e => {
    e.preventDefault();
    const newToy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    };
    addNewToy(newToy);
  });

  // POST request to add new toy
  function addNewToy(toy) {
    fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(toy)
    })
    .then(res => res.json())
    .then(toy => {
      renderToy(toy);
      toyFormContainer.style.display = 'none';
      addToy = false;
      toyForm.reset();
    });
  }

  // Increase the likes of a toy
  function increaseLikes(toy) {
    toy.likes++;
    fetch(`${baseUrl}/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: toy.likes })
    })
    .then(res => res.json())
    .then(updatedToy => {
      const likeP = document.querySelector(`#like-${toy.id}`).previousElementSibling;
      likeP.innerText = `${updatedToy.likes} Likes`;
    });
  }

  fetchToys(); 
});
