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
  await fetch(`/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: text })
  });
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
      const id = box.querySelector(".comment-body").dataset.commentId;
      await deleteComment(id);
      container.removeChild(box);
    });

    editBtn.addEventListener("click", async () => {
      const body = box.querySelector(".comment-body");

      if (editBtn.textContent === "Edit") {
        const textarea = document.createElement("textarea");
        textarea.value = body.textContent;
        textarea.className = "edit-textarea";
        box.replaceChild(textarea, body);

        editBtn.textContent = "Save";
        cancelBtn.style.display = "inline-block";

        cancelBtn.onclick = () => {
          box.replaceChild(body, textarea);
          editBtn.textContent = "Edit";
          cancelBtn.style.display = "none";
        };
      } else {
        const textarea = box.querySelector(".edit-textarea");
        const newText = textarea.value.trim();
        const id = body.dataset.commentId;

        const newBody = document.createElement("div");
        newBody.className = "comment-body";
        newBody.dataset.commentId = id;
        newBody.dataset.username = body.dataset.username;
        newBody.textContent = newText;

        box.replaceChild(newBody, textarea);
        editBtn.textContent = "Edit";
        cancelBtn.style.display = "none";

        const editedTime = new Date().toLocaleString();
        box.querySelector(".timestamp").textContent = `Edited at ${editedTime}`;

        await updateComment(id, newText);
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
