// const newFormHandler = async (event) => {
//   event.preventDefault();

//   const name = document.querySelector('#post-name').value.trim();
//   const content = document.querySelector('#post-content').value.trim();

//   if (name && content) {
//     const response = await fetch(`/api/posts`, {
//       method: 'POST',
//       body: JSON.stringify({ title: name, content }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       document.location.replace('/profile');
//     } else {
//       alert('Failed to create post');
//     }
//   }
// };

// const delButtonHandler = async (event) => {
//   if (event.target.hasAttribute('data-id')) {
//     const id = event.target.getAttribute('data-id');

//     const response = await fetch(`/api/posts/${id}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       document.location.replace('/profile');
//     } else {
//       alert('Failed to delete post');
//     }
//   }
// };
// const fetchPosts = async () => {
//   const response = await fetch('/api/posts');
//   const data = await response.json();
//   const postList = document.querySelector('.post-list');
//   postList.innerHTML = '';

//   data.forEach(post => {
//     const postDiv = document.createElement('div');
//     postDiv.classList.add('post-div');

//     const titleDiv = document.createElement('div');
//     titleDiv.classList.add('title-div');
//     titleDiv.innerHTML = `<h3>${post.title}</h3>`;
//     postDiv.appendChild(titleDiv);

//     const contentDiv = document.createElement('div');
//     contentDiv.classList.add('content-div');
//     contentDiv.innerHTML = `<p>${post.content}</p>`;
//     postDiv.appendChild(contentDiv);

//     const buttonDiv = document.createElement('div');
//     buttonDiv.classList.add('button-div');
//     buttonDiv.innerHTML = `
//       <button type="button" data-id="${post.id}" class="delete-btn btn btn-danger">Delete</button>
//     `;
//     postDiv.appendChild(buttonDiv);

//     postList.appendChild(postDiv);
//   });
// };

// // add event listener to submit button
// document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);

// // add event listener to delete button
// document.querySelector('.post-list').addEventListener('click', delButtonHandler);

// // fetch posts on page load
// fetchPosts();

// const postButton = document.querySelector('#post-button');
// const newPostForm = document.querySelector('.new-post-form');

// postButton.addEventListener('click', () => {
//   if (newPostForm.style.display === 'none') {
//     newPostForm.style.display = 'block';
//   } else {
//     newPostForm.style.display = 'none';
//   }
// });


// When a delete button is clicked, it sends a DELETE request to the server to delete the associated post, and then redirects to the dashboard page if successful
const deleteButtons = document.querySelectorAll('.delete-btn');

deleteButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const id = button.getAttribute('data-id');

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete post');
    }
  });
});

const commentButtons = document.querySelectorAll('.comment-btn');

commentButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const id = button.getAttribute('data-id');
    const postElement = button.closest('.post'); // find the parent post element

    const form = document.createElement('form');
    const textarea = document.createElement('textarea');
    textarea.name = 'comment';
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';

    form.appendChild(textarea);
    form.appendChild(submitButton);

    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // prevent form submission from reloading the page

      const commentData = {
        comment: textarea.value,
        post_id: id,
      };

      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify(commentData),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const comment = await response.json();

          // Add the new comment to the comments section
          const commentsSection = button.parentElement.querySelector('.comments');
          const commentElement = document.createElement('div');
          commentElement.innerText = `${comment.author}: ${comment.text}`;
          commentsSection.appendChild(commentElement);

          // Clear the form
          textarea.value = '';
          form.innerHTML = '';
        } else {
          alert('Failed to add comment');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to add comment');
      }
    });

    postElement.appendChild(form);
  });
});
// When the edit button is clicked, it sends a PUT request to the server to update the associated post with new data, and updates the post on the client side if successful.

const editButton = document.querySelector('.edit-btn');

editButton.addEventListener('click', async () => {
  const postId = editButton.dataset.id;
  const updatedPostData = {
    title: 'New Title',
    content: 'New Content',
    // add more properties to update as needed
  };

  try {
    const response = await fetch(`/api/posts/${postId}/edit`, {
      method: 'PUT',
      body: JSON.stringify(updatedPostData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const post = await response.json();
      // update post on the client side with new data
      // e.g. update the post title, content, etc.
    } else {
      alert('Failed to update post');
    }
  } catch (err) {
    console.error(err);
    alert('Failed to update post');
  }
});
