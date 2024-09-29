

// Display posts on the page
function displayPosts(posts) {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';  // Clear loading text

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('card', 'mb-3');
    postElement.innerHTML = `
      ${post.imageUrl ? `<img src="${post.imageUrl}" class="card-img-top" alt="Post Image">` : ''}
      <div class="card-body">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${post.body}</p>
      </div>
    `;
    postsContainer.appendChild(postElement);
  });
}


// Add a new post to the page without refreshing
function addPostToPage(title, body, imageUrl) {
  const postsContainer = document.getElementById('posts');

  const postElement = document.createElement('div');
  postElement.classList.add('card', 'mb-3');
  postElement.innerHTML = `
    ${imageUrl ? `<img src="${imageUrl}" class="card-img-top" alt="Post Image">` : ''}
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${body}</p>
    </div>
    <div class="card-footer d-flex justify-content-between">
        <div class="like">
            <i class="like-button bi-heart"></i>
            <span class="like-count ms-1">0</span> likes</div>
        <div class="delete">
            <i class="delete-button bi-trash"></i>
        </div>
    </div>
  `;
  postsContainer.prepend(postElement);  // Add new post to the top of the list
  postElement.querySelector('.like-button').addEventListener("click", function(e){
    e.target.classList.toggle("bi-heart");
    e.target.classList.toggle("bi-heart-fill");
    e.target.classList.toggle("text-danger");

    likes = postElement.querySelector('.like-count').textContent;
    postElement.querySelector('.like-count').textContent = likes == "1" ? 0 : 1;

  });
  postElement.querySelector('.delete-button').addEventListener("click", function(e){
    if (confirm("Are you sure you want to delete this post?")){
        postElement.remove();
    } 
  });
}

// Handle form submission to create a new post
document.getElementById('postForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  const imageUrl = document.getElementById('imageUrl').value;

  if (title && body) { 
    addPostToPage(title, body, imageUrl || null); // Pass null if no image URL is provided
    // Clear form fields after submission
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
    document.getElementById('imageUrl').value = '';
  } else {
    alert('Please fill in both the title and body');
  }
});

 