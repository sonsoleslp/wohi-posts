// Fetch posts from JSONbin.io API and display them on the page
async function fetchPosts() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Access-Key': accessKey  // Use Access Key instead of Master Key
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    const posts = result.record.posts;  // Extract posts from the bin
    displayPosts(posts);
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('posts').innerHTML = '<p>Error loading posts</p>';
  }
}

// Display posts on the page
function displayPosts(posts) {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';  // Clear loading text

  posts.forEach(post => {
    addPostToPage(post.title, post.body, post.id, post.likes || 0, post.imageUrl);
  });
}

// Post a new post to JSONbin.io and add it to the bin
async function createPost(title, body, imageUrl) {
  try {
    // Fetch existing posts
    const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Access-Key': accessKey  // Use Access Key
      }
    });

    const getResult = await getResponse.json();
    const posts = getResult.record.posts;
    const id = new Date();
    // Add the new post to the posts array
    posts.unshift({ id, title, body, likes, imageUrl });

    // Update the bin with the new posts array
    const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': accessKey  // Use Access Key
      },
      body: JSON.stringify({ posts: posts })
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to create post');
    }

    addPostToPage(title, body, id, likes, imageUrl);  // Add new post to the page
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Error creating post');
  }
}

// Add a new post to the page without refreshing
function addPostToPage(title, body, id, likes, imageUrl) {
    const postsContainer = document.getElementById('posts');
  
    const postElement = document.createElement('div');
    postElement.id = id;
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
                <span class="like-count ms-1">${likes}</span> likes</div>
            <div class="delete">
                <i class="delete-button bi-trash"></i>
            </div>
        </div>
    `;
    postsContainer.prepend(postElement);  // Add new post to the top of the list
    postElement.querySelector('.like-button').addEventListener("click", async function(e){
        try {
            const likes = await likePost(id,  e.target.classList.contains("bi-heart")) 
            e.target.classList.toggle("bi-heart");
            e.target.classList.toggle("bi-heart-fill");
            e.target.classList.toggle("text-danger");

            postElement.querySelector('.like-count').textContent = likes;
           
        } catch (error) {
            console.error(error)
            alert("There was an error!");
        }
    });
    postElement.querySelector('.delete-button').addEventListener("click", async function(e){
    if (confirm("Are you sure you want to delete this post?")){
        try {
            await deletePost(id);
            postElement.remove();
        } catch (error) {
            console.error(error)
            alert("There was an error!");
        }
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
    createPost(title, body, imageUrl || null);  // Pass null if no image URL is provided

    // Clear form fields after submission
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
    document.getElementById('imageUrl').value = '';
  } else {
    alert('Please fill in both the title and body');
  }
});

async function likePost(id, like) {
    const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Access-Key': accessKey  // Use Access Key
        }
      });
  
      const getResult = await getResponse.json();
      const posts = getResult.record.posts.map(post => {
        if (post.id == id) {
            return {...post,
                likes:  post.likes = (post.likes || 0 ) + (like ? 1 : -1)
             }
        } else {
            return post;
        }
      })
      const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': accessKey  // Use Access Key
        },
        body: JSON.stringify({ posts: posts })
      });

      
      return posts.find(post => post.id == id).likes || 0;
}

async function deletePost(id) {
    const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Access-Key': accessKey  // Use Access Key
        }
      });
  
      const getResult = await getResponse.json();
      const posts = getResult.record.posts.filter(post => post.id != id)
      const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': accessKey  // Use Access Key
        },
        body: JSON.stringify({ posts: posts })
      });
}
// Call the function to fetch and display the posts
fetchPosts();
