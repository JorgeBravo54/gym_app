// Create (returns new id)
async function createComment(text) {
  const res = await fetch("/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: text })
  });
  const data = await res.json();
  return data.id; // backend should return {id: newId}
}

// Update by id
async function updateComment(id, text) {
  const res = await fetch(`/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: text })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Update failed (${res.status}): ${err}`);
  }
  return res.json();
}


// Delete by id
async function deleteComment(id) {
  await fetch(`/comments/${id}`, { method: "DELETE" });
}

// Render a single comment box (used by onload and create)
function renderCommentBox({ id, username, comment, canEdit }) {
  const container = document.getElementById("comment_container");
  const now = new Date().toLocaleString();

  const box = document.createElement("div");
  box.className = "comment_box";
  box.innerHTML = `
    <div class="comment-header">
      <h2>@${username}</h2>
      <span class="timestamp">Posted at ${now}</span>
    </div>
    <div class="comment-body" data-comment-id="${id}" data-username="${username}">${comment}</div>
    <div class="comment-actions">
      ${canEdit ? `
        <button class="delete-btn">Delete</button>
        <button class="edit-btn">Edit</button>
        <button class="cancel-btn" style="display:none;">Cancel</button>
      ` : ``}
    </div>
  `;

  if (canEdit) {
    const deleteBtn = box.querySelector(".delete-btn");
    const editBtn = box.querySelector(".edit-btn");
    const cancelBtn = box.querySelector(".cancel-btn");

    deleteBtn.addEventListener("click", async () => {
      const bodyEl = box.querySelector(".comment-body");
      const commentId = bodyEl?.dataset.commentId;
      if (!commentId) return;
      await deleteComment(commentId);
      container.removeChild(box);
    });

    editBtn.addEventListener("click", async () => {
      const bodyEl = box.querySelector(".comment-body");

      if (editBtn.textContent === "Edit") {
        // Create textarea and copy datasets
        const textarea = document.createElement("textarea");
        textarea.value = bodyEl.textContent;
        textarea.className = "edit-textarea";
        textarea.dataset.commentId = bodyEl.dataset.commentId;
        textarea.dataset.username = bodyEl.dataset.username;

        box.replaceChild(textarea, bodyEl);

        deleteBtn.style.display = "none";
        editBtn.textContent = "Save";
        cancelBtn.style.display = "inline-block";

        cancelBtn.onclick = () => {
          // Restore original body
          box.replaceChild(bodyEl, textarea);
          editBtn.textContent = "Edit";
          cancelBtn.style.display = "none";
          deleteBtn.style.display = "inline-block";
        };
      } else {
        // Save branch
        const textarea = box.querySelector(".edit-textarea");
        if (!textarea) return;

        const newText = textarea.value.trim();
        const commentId = textarea.dataset.commentId;
        const uname = textarea.dataset.username;

        // Recreate body with saved datasets
        const newBody = document.createElement("div");
        newBody.className = "comment-body";
        newBody.dataset.commentId = commentId;
        newBody.dataset.username = uname;
        newBody.textContent = newText;

        box.replaceChild(newBody, textarea);
        editBtn.textContent = "Edit";
        cancelBtn.style.display = "none";
        deleteBtn.style.display = "inline-block";

        const editedTime = new Date().toLocaleString();
        box.querySelector(".timestamp").textContent = `Edited at ${editedTime}`;

        try {
          await updateComment(commentId, newText);
        } catch (e) {
          console.error(e);
          alert("Failed to save comment. Please try again.");
        }
      }
    });
  }

  container.appendChild(box);
  return box;
}


// Create from input (keeps your UI flow)
async function createCommentBox() {
  const currentUser = document.getElementById("username").dataset.user;
  const text = document.getElementById("comment-input").value.trim();
  if (!text) return;

  // 1) Create in DB, get id
  const newId = await createComment(text);

  // 2) Render with id and edit/delete enabled
  renderCommentBox({ id: newId, username: currentUser, comment: text, canEdit: true });

  document.getElementById("comment-input").value = "";
}

// Load all on page load
window.onload = async function () {
  const res = await fetch("/comments");
  const saved = await res.json(); // expect [{id, username, comment}, ...]
  const currentUser = document.getElementById("username").dataset.user;

  const container = document.getElementById("comment_container");
  container.innerHTML = "";

  saved.forEach(r => {
    renderCommentBox({
      id: r.id,
      username: r.username,
      comment: r.comment,
      canEdit: r.username === currentUser
    });
  });
};
