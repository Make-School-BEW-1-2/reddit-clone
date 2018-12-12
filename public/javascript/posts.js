document.querySelector('.post-list').addEventListener('submit', (e) => {
  const elem = e.target;
  if (elem.classList.contains('vote-up')) {
    e.preventDefault();
    const postId = elem.dataset.id;
    axios
      .put(`/posts/${postId}/vote-up`)
      .then((res) => {
        console.log('voted up!');
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (elem.classList.contains('vote-down')) {
    e.preventDefault();
    const postId = elem.dataset.id;
    axios
      .put(`/posts/${postId}/vote-down`)
      .then((res) => {
        console.log('voted down!');
      })
      .catch((err) => {
        console.error(err);
      });
  }
})
