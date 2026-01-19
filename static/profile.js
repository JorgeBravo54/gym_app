function saveRoutines() {
  const routines = {};

  document.querySelectorAll("#routine-container .routine-box").forEach((box, index) => {
    const routineId = box.dataset.routineId; // use dataset for consistency
    routines[routineId] = [];

    box.querySelectorAll(".detail-box").forEach(detail => {
      const func = detail.querySelector(".func-name").textContent;
      const reps = detail.querySelectorAll("input[type='number']")[0].value || 0;
      const sets = detail.querySelectorAll("input[type='number']")[1].value || 0;
      const weight = detail.querySelectorAll("input[type='number']")[2]?.value || 0;

      routines[routineId].push({
        function: func,
        reps: parseInt(reps, 10),
        sets: parseInt(sets, 10),
        weight: parseInt(weight, 10)
      });
    });
  });

  fetch("/routines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ routines })
  });
}

let routineCounter = 0;
function createRoutineBox(rid = null) {
  // If rid comes from backend use it, increment counther otherwise
  const routineId = rid ? parseInt(rid, 10) : ++routineCounter;

  const container = document.getElementById("routine-container");
  const box = document.createElement("div");
  box.className = "routine-box";
  box.dataset.routineId = routineId;

  box.innerHTML = `
    <h3>Routine ${routineId}</h3>
    <select id="routine-${routineId}">
      <option value="">-- Select a function --</option>
      <option value="Bench press">Bench press</option>
      <option value="Incline press">Incline press</option>
      <option value="Chest flyes">Chest flyes</option>
      <option value="Dips">Dips</option>
      <option value="Lat pulldown">Lat pulldown</option>
      <option value="Pull-ups">Pull-ups</option>
      <option value="Seated cable row">Seated cable row</option>
      <option value="Bent-Over Row">Bent-Over Row</option>
      <option value="Deadlift">Deadlift</option>
      <option value="Barbell squat">Barbell squat</option>
      <option value="Leg press">Leg press</option>
      <option value="Leg Extension">Leg Extension</option>
      <option value="Leg Curl">Leg Curl</option>
      <option value="Shoulder press">Shoulder press</option>
      <option value="Lateral raises">Lateral raises</option>
      <option value="Rear Delt Fly">Rear Delt Fly</option>
      <option value="Bicep Curl">Bicep Curl</option>
      <option value="Hammer Curl">Hammer Curl</option>
      <option value="Tricep Pushdown">Tricep Pushdown</option>
      <option value="Skull Crushers">Skull Crushers</option>
    </select>
    <div class="routine-details"></div>
    <button class="delete-btn">Delete Routine</button>
  `;

  box.querySelector(".delete-btn").addEventListener("click", () => {
    container.removeChild(box);
    saveRoutines();
  });

  const select = box.querySelector("select");
  const details = box.querySelector(".routine-details");

  select.addEventListener("change", () => {
    const value = select.value;
    if (value) {
      const detailBox = document.createElement("div");
      detailBox.className = "detail-box";
      detailBox.innerHTML = `
        <span class="func-name">${value}</span>
        <span>Sets</span><input type="number" min="1" placeholder="Qty"
        <span>Reps</span><input type="number" min="1" placeholder="Qty">
        <span>Kg</span><input type="number" min="1" placeholder="Qty">
        <button class="detail-delete">✖</button>
      `;

      // attach listeners to inputs
      detailBox.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", saveRoutines);
      });

      detailBox.querySelector(".detail-delete").addEventListener("click", () => {
        details.removeChild(detailBox);
        saveRoutines();
      });

      details.appendChild(detailBox);
      saveRoutines();
    }
  });

  container.appendChild(box);
  return box;
}

window.onload = async function() {
  const res = await fetch("/routines");
  const saved = await res.json();

  // routineCounter set to max id so the new boxes get higher ids
  const maxRid = Math.max(...Object.keys(saved).map(rid => parseInt(rid, 10)), 0);
  routineCounter = maxRid

  Object.keys(saved).forEach(rid => {
    const box = createRoutineBox(rid);
    const details = box.querySelector(".routine-details");

    saved[rid].forEach(r => {
      const detailBox = document.createElement("div");
      detailBox.className = "detail-box";
      detailBox.innerHTML = `
        <span class="func-name">${r.function}</span>
        <span>Reps</span><input type="number" min="1" value="${r.reps}">
        <span>Sets</span><input type="number" min="1" value="${r.sets}">
        <span>Kg</span><input type="number" min="1" value="${r.weight}">
        <button class="detail-delete">✖</button>
      `;

      detailBox.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", saveRoutines);
      });

      detailBox.querySelector(".detail-delete").addEventListener("click", () => {
        details.removeChild(detailBox);
        saveRoutines();
      });

      details.appendChild(detailBox);
    });
  });
};
