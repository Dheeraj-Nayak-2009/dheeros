const ICON_GRID_COLS = 1; // One column like classic desktops
const ICON_WIDTH = 120; // Increased width
const ICON_HEIGHT = 140; // Increased height
const ICON_GAP_Y = 20; // Increased gap

window.addEventListener("DOMContentLoaded", () => {
  // Load saved wallpaper
  const savedWallpaper = localStorage.getItem("selectedWallpaper");
  if (savedWallpaper) {
    document.documentElement.style.setProperty("--wallpaper", `url('${savedWallpaper}')`);
  }

  // Load saved fonts
  const systemFont = localStorage.getItem("systemFont") || "Poppins";
  const weekFont = localStorage.getItem("weekFont") || "Monoton";
  document.documentElement.style.setProperty("--system-font", `'${systemFont}', sans-serif`);
  document.documentElement.style.setProperty("--week-font", `'${weekFont}', sans-serif`);

  // Load saved font colors
  const clockFontColor = localStorage.getItem("clockFontColor") || "#ffffff";
  const systemFontColor = localStorage.getItem("systemFontColor") || "#ffffff";
  document.documentElement.style.setProperty("--clock-font-color", clockFontColor);
  document.documentElement.style.setProperty("--system-font-color", systemFontColor);

  // Load saved wallpaper blur
  const wallpaperBlur = localStorage.getItem("wallpaperBlur") || "5px";
  document.getElementById("wallpaper").style.filter = `blur(${wallpaperBlur})`;
});

function updateClock() {
  const now = new Date();
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  const timeStr = now.toLocaleTimeString('en-US', options);
  document.getElementById("clock").textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock(); // initial call

function updateDesktopClock() {
  const now = new Date();

  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const months = ["January","February","March","April","May","June","July",
                  "August","September","October","November","December"];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  const dateStr = `${date}${getSuffix(date)} ${monthName}, ${year}`;

  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  const timeStr = now.toLocaleTimeString('en-US', options);

  document.getElementById("dc-day").textContent = dayName;
  document.getElementById("dc-date").textContent = dateStr;
  document.getElementById("dc-time").textContent = timeStr;
}

function getSuffix(n) {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

setInterval(updateDesktopClock, 1000);
updateDesktopClock();

let zIndexCounter = 100;
let runningApps = {};

function openApp(appName) {
  if (runningApps[appName]) return; // prevent multiple opens

  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.zIndex = ++zIndexCounter;

  // Set window content based on app
  if (appName === "browser") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Browser</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        <iframe src="apps/browser.html" style="width:100%; height:100%; border:none;"></iframe>
      </div>
    `;
  } else if (appName === "notepad") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Notepad</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        <iframe src="apps/notepad.html" style="width:100%; height:100%; border:none;"></iframe>
      </div>
    `;
  } else if (appName === "ide") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Web IDE</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
<iframe src="https://liveweave.com/" width="100%" height="100%" frameborder="0"></iframe>

      </div>
    `;
    } else if (appName === "python") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Python IDE</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
<iframe src="https://onecompiler.com/embed/python" width="100%" height="100%" frameborder="0"></iframe>

      </div>
    `;
  } else if (appName === "game") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Games</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        <iframe src="apps/games.html" style="width:100%; height:100%; border:none;"></iframe>
      </div>
    `;
    setTimeout(() => {
  const wallpaperSelect = document.getElementById("wallpaper-select");
  const customInput = document.getElementById("custom-wallpaper");

  wallpaperSelect.addEventListener("change", () => {
    if (wallpaperSelect.value === "custom") {
      customInput.style.display = "block";
    } else {
      customInput.style.display = "none";
    }
  });
}, 100); // slight delay for DOM to exist

  }
  else if (appName === "settings") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Settings</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body settings-body">
        <h2>Choose Wallpaper</h2>
        <div id="wallpaper-grid" class="wallpaper-grid"></div>
        <div class="custom-wallpaper-url">
          <input type="text" id="custom-wallpaper-url" placeholder="Paste custom wallpaper URL here" />
          <button id="add-wallpaper-btn">Add Wallpaper</button>
        </div>
        <div class="wallpaper-blur">
          <label for="wallpaper-blur-slider">Wallpaper Blur:</label>
          <input type="range" id="wallpaper-blur-slider" min="0" max="10" step="1" value="5" />
        </div>
        <h2>Font Settings</h2>
        <div class="other-settings">
          <label for="system-font-select">System Font:</label>
          <select id="system-font-select">
            <option value="Poppins">Poppins</option>
            <option value="Orbitron">Orbitron</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Oswald">Oswald</option>
            <option value="Righteous">Righteous</option>
            <option value="Monoton">Monoton</option>
            <option value="Black Ops One">Black Ops One</option>
            <option value="Tilt Prism">Tilt Prism</option>
          </select>
          <label for="week-font-select">Clock Font:</label>
          <select id="week-font-select">
            <option value="Poppins">Poppins</option>
            <option value="Orbitron">Orbitron</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Oswald">Oswald</option>
            <option value="Righteous">Righteous</option>
            <option value="Monoton">Monoton</option>
            <option value="Black Ops One">Black Ops One</option>
            <option value="Tilt Prism">Tilt Prism</option>
          </select>
          <label for="clock-font-color">Clock Font Color:</label>
          <input type="color" id="clock-font-color" value="#ffffff" />
          <label for="system-font-color">System Font Color:</label>
          <input type="color" id="system-font-color" value="#ffffff" />
        </div>
      </div>
    `;

    // Populate the wallpaper grid
    const wallpaperGrid = win.querySelector("#wallpaper-grid");
    const wallpapers = JSON.parse(localStorage.getItem("wallpapers")) || [
      "assets/wallpapers/wall1.jpg",
      "assets/wallpapers/wall2.png",
      "assets/wallpapers/wall3.png",
    ];

    function renderWallpapers() {
      wallpaperGrid.innerHTML = ""; // Clear the grid
      wallpapers.forEach((wallpaper) => {
        const img = document.createElement("img");
        img.src = wallpaper;
        img.className = "wallpaper-thumbnail";
        img.onclick = () => {
          document.documentElement.style.setProperty("--wallpaper", `url('${wallpaper}')`);
          localStorage.setItem("selectedWallpaper", wallpaper);
        };
        wallpaperGrid.appendChild(img);
      });
    }

    renderWallpapers();

    // Add functionality to handle custom wallpaper URL
    const addWallpaperBtn = win.querySelector("#add-wallpaper-btn");
    const customWallpaperInput = win.querySelector("#custom-wallpaper-url");

    addWallpaperBtn.onclick = () => {
      const url = customWallpaperInput.value.trim();
      if (url) {
        wallpapers.push(url);
        localStorage.setItem("wallpapers", JSON.stringify(wallpapers));
        renderWallpapers(); // Re-render the grid
        customWallpaperInput.value = ""; // Clear the input
      } else {
        alert("Please enter a valid URL.");
      }
    };

    // Handle wallpaper blur slider
    const blurSlider = win.querySelector("#wallpaper-blur-slider");
    blurSlider.value = parseInt(localStorage.getItem("wallpaperBlur")) || 5;
    blurSlider.oninput = () => {
      const blurValue = `${blurSlider.value}px`;
      document.getElementById("wallpaper").style.filter = `blur(${blurValue})`;
      localStorage.setItem("wallpaperBlur", blurValue);
    };

    // Apply font settings
    const systemFontSelect = win.querySelector("#system-font-select");
    const weekFontSelect = win.querySelector("#week-font-select");
    const clockFontColorInput = win.querySelector("#clock-font-color");
    const systemFontColorInput = win.querySelector("#system-font-color");

    systemFontSelect.value = localStorage.getItem("systemFont") || "Poppins";
    weekFontSelect.value = localStorage.getItem("weekFont") || "Monoton";
    clockFontColorInput.value = localStorage.getItem("clockFontColor") || "#ffffff";
    systemFontColorInput.value = localStorage.getItem("systemFontColor") || "#ffffff";

    systemFontSelect.onchange = () => {
      const selectedFont = systemFontSelect.value;
      document.documentElement.style.setProperty("--system-font", `'${selectedFont}', sans-serif`);
      localStorage.setItem("systemFont", selectedFont);
    };

    weekFontSelect.onchange = () => {
      const selectedFont = weekFontSelect.value;
      document.documentElement.style.setProperty("--week-font", `'${selectedFont}', sans-serif`);
      localStorage.setItem("weekFont", selectedFont);
    };

    clockFontColorInput.oninput = () => {
      const color = clockFontColorInput.value;
      document.documentElement.style.setProperty("--clock-font-color", color);
      localStorage.setItem("clockFontColor", color);
    };

    systemFontColorInput.oninput = () => {
      const color = systemFontColorInput.value;
      document.documentElement.style.setProperty("--system-font-color", color);
      localStorage.setItem("systemFontColor", color);
    };
  }
  else if (appName === "maps") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Maps</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31088.335460379643!2d74.73248567017628!3d13.353633799999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc90271b8e6b49%3A0x966d8326c52c69bb!2sNittur%2C%20Udupi%2C%20Karnataka%20576102!5e0!3m2!1sen!2sin!4v1721219129324!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    `;
  } else if (appName === "calc") {
  win.innerHTML = `
    <div class="window-header" onmousedown="dragStart(event, this)">
      <span>Calculator</span>
      <div class="window-controls">
        <button onclick="minimizeApp('${appName}')">—</button>
        <button onclick="toggleMaximize(this)">🗖</button>
        <button onclick="closeApp('${appName}', this)">✖</button>
      </div>
    </div>
    <div class="window-body">	
      <iframe src="https://www.desmos.com/scientific" width="100%" height="600" style="border: none;"></iframe>
 
    </div>
  `;

  } else if (appName === "paint") {
  win.innerHTML = `
    <div class="window-header" onmousedown="dragStart(event, this)">
      <span>PaintNinja</span>
      <div class="window-controls">
        <button onclick="minimizeApp('${appName}')">—</button>
        <button onclick="toggleMaximize(this)">🗖</button>
        <button onclick="closeApp('${appName}', this)">✖</button>
      </div>
    </div>
    <div class="window-body" style="padding: 0;">
      <iframe src="https://dheeraj-nayak-2009.github.io/Paint/" width="100%" height="100%" style="border: none;"></iframe>
    </div>
  `;
}
  else if (appName === "weather") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Weather</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        <iframe src="https://dheeraj-nayak-2009.github.io/Weather-App" style="width:100%; height:100%; border:none;"></iframe>
      </div>
    `;
  }
  else if (appName === "ex") {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>Weather</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        <iframe src="apps/explorer.html" style="width:100%; height:100%; border:none;"></iframe>
      </div>
    `;
  }
  else {
    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>${appName.toUpperCase()}</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appName}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appName}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        ${appName} app goes here...
      </div>
    `;
  }

  // ✅ Append resize handles AFTER setting innerHTML
  const handles = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
  handles.forEach(dir => {
    const handle = document.createElement('div');
    handle.className = `resize-handle ${dir}`;
    win.appendChild(handle);
  });

  // Add window to DOM
  win.dataset.app = appName;
  document.getElementById("windows").appendChild(win);
  runningApps[appName] = win;

  addTaskbarIcon(appName);
}

function closeApp(appName, btn) {
  const win = runningApps[appName];
  if (win) win.remove();
  delete runningApps[appName];
  removeTaskbarIcon(appName);

  // ❌ REMOVE THIS BLOCK IF PRESENT:
  // const anyMaximized = [...document.querySelectorAll('.window')]
  //   .some(w => w.classList.contains('maximized'));
  // if (!anyMaximized) {
  //   document.getElementById("taskbar").style.display = "flex";
  // }
}


function minimizeApp(appName) {
  const win = runningApps[appName];
  if (win) win.style.display = "none";

  // ✅ Show taskbar if no visible & no maximized windows
  const anyVisible = [...document.querySelectorAll('.window')].some(w => w.style.display !== "none");
  const anyMaximized = [...document.querySelectorAll('.window')].some(w => w.classList.contains('maximized'));

  if (!anyVisible && !anyMaximized) {
    document.getElementById("taskbar").style.display = "flex";
  }
}


function toggleMaximize(btn) {
  const win = btn.closest(".window");
  win.classList.toggle("maximized");

  // ❌ REMOVE or COMMENT THIS:
  // const taskbar = document.getElementById("taskbar");
  // if (win.classList.contains("maximized")) {
  //   taskbar.style.display = "none";
  // } else {
  //   taskbar.style.display = "flex";
  // }
}

// Taskbar logic
function addTaskbarIcon(appName) {
  const btn = document.createElement("button");
  btn.textContent = appName;
  btn.onclick = () => {
    const win = runningApps[appName];
    if (win.style.display === "none") win.style.display = "block";
    win.style.zIndex = ++zIndexCounter;
  };
  btn.id = `task-${appName}`;
  document.getElementById("taskbar-apps").appendChild(btn);
}

function removeTaskbarIcon(appName) {
  const btn = document.getElementById(`task-${appName}`);
  if (btn) btn.remove();
}

// Dragging
let offsetX, offsetY, draggingWin;

function dragStart(e, header) {
  const win = header.parentElement;
  draggingWin = win;
  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;
  win.style.zIndex = ++zIndexCounter;
  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragEnd);
}

function dragMove(e) {
  if (!draggingWin) return;
  draggingWin.style.left = `${e.clientX - offsetX}px`;
  draggingWin.style.top = `${e.clientY - offsetY}px`;
}

function dragEnd() {
  draggingWin = null;
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", dragEnd);
}

let draggedIcon = null;
let gridSize = 80;

document.querySelectorAll('.icon').forEach(icon => {
  icon.draggable = true;

  icon.addEventListener('dragstart', (e) => {
    draggedIcon = icon;
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  });

  icon.addEventListener('dragend', (e) => {
    const desktop = document.getElementById('desktop-icons');
    const rect = desktop.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Snap to grid
    x = Math.round(x / gridSize) * gridSize;
    y = Math.round(y / gridSize) * gridSize;

    draggedIcon.style.position = 'absolute';
    draggedIcon.style.left = `${x}px`;
    draggedIcon.style.top = `${y}px`;
    desktop.appendChild(draggedIcon);

    draggedIcon = null;
  });
});

document.addEventListener('mouseup', (e) => {
  if (!draggingWin) return;

  const win = draggingWin;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const threshold = 50;
  const x = e.clientX;
  const y = e.clientY;

  // Snap logic
  if (x < threshold) {
    // Left half
    win.style.top = '0';
    win.style.left = '0';
    win.style.width = '50vw';
    win.style.height = '100vh';
  } else if (x > screenWidth - threshold) {
    // Right half
    win.style.top = '0';
    win.style.left = '50vw';
    win.style.width = '50vw';
    win.style.height = '100vh';
  } else if (y < threshold) {
    // Maximize
    win.classList.add('maximized');
  } else {
    win.classList.remove('maximized');
  }

  dragEnd(); // End dragging
});

let resizing = false;
let resizeDir = null;
let startX, startY, startWidth, startHeight, startTop, startLeft;
let activeWindow = null;

document.addEventListener('mousedown', (e) => {
  const handle = e.target.closest('.resize-handle');
  if (!handle) return;

  resizing = true;
  resizeDir = [...handle.classList].find(c => c !== 'resize-handle');
  activeWindow = handle.parentElement;

  const rect = activeWindow.getBoundingClientRect();
  startX = e.clientX;
  startY = e.clientY;
  startWidth = rect.width;
  startHeight = rect.height;
  startTop = rect.top;
  startLeft = rect.left;

  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!resizing || !activeWindow) return;

  let dx = e.clientX - startX;
  let dy = e.clientY - startY;

  if (resizeDir.includes('right')) {
    activeWindow.style.width = `${startWidth + dx}px`;
  }
  if (resizeDir.includes('bottom')) {
    activeWindow.style.height = `${startHeight + dy}px`;
  }
  if (resizeDir.includes('left')) {
    activeWindow.style.width = `${startWidth - dx}px`;
    activeWindow.style.left = `${startLeft + dx}px`;
  }
  if (resizeDir.includes('top')) {
    activeWindow.style.height = `${startHeight - dy}px`;
    activeWindow.style.top = `${startTop + dy}px`;
  }
});

document.addEventListener('mouseup', () => {
  resizing = false;
  resizeDir = null;
  activeWindow = null;
});

window.addEventListener("message", (event) => {
  if (event.data?.type === "open-game") {
    const { title, url } = event.data;

    // Use unique appName to allow multiple games
    const appId = "game_" + Math.random().toString(36).substr(2, 5);
    const win = document.createElement("div");
    win.className = "window";
    win.style.top = "120px";
    win.style.left = "120px";
    win.style.zIndex = ++zIndexCounter;

    win.innerHTML = `
      <div class="window-header" onmousedown="dragStart(event, this)">
        <span>${title}</span>
        <div class="window-controls">
          <button onclick="minimizeApp('${appId}')">—</button>
          <button onclick="toggleMaximize(this)">🗖</button>
          <button onclick="closeApp('${appId}', this)">✖</button>
        </div>
      </div>
      <div class="window-body">
        <iframe src="${url}" style="width:100%; height:100%; border:none;"></iframe>
      </div>
    `;

    win.dataset.app = appId;
    document.getElementById("windows").appendChild(win);
    runningApps[appId] = win;
  }
});


function applySettings() {
  const wall = document.getElementById("wallpaper-select").value;
  let wallURL = "";

  if (wall === "custom") {
    wallURL = document.getElementById("custom-wallpaper").value.trim();
    if (!wallURL.startsWith("http")) {
      alert("Invalid URL");
      return;
    }
  } else {
    wallURL = `assets/wallpapers/${wall}`;
  }

  document.documentElement.style.setProperty("--wallpaper", `url('${wallURL}')`);

  // Font changes
  const sysFont = document.getElementById("system-font-select").value;
  const weekFont = document.getElementById("week-font-select").value;

  // Dynamically inject Google Fonts
  loadGoogleFont(sysFont);
  loadGoogleFont(weekFont);

  document.documentElement.style.setProperty("--system-font", `'${sysFont}', sans-serif`);
  document.documentElement.style.setProperty("--week-font", `'${weekFont}', sans-serif`);
}

function loadGoogleFont(name) {
  const id = `gf-${name.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}&display=swap`;
  document.head.appendChild(link);
}

