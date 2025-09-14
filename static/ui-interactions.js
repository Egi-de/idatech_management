document.addEventListener("DOMContentLoaded", function () {
  // User profile dropdown toggle
  const userProfileBtn = document.querySelector(".relative.group > button");
  const userDropdown = userProfileBtn
    ? userProfileBtn.nextElementSibling
    : null;

  if (userProfileBtn && userDropdown) {
    userProfileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isVisible = userDropdown.classList.contains("opacity-100");
      if (isVisible) {
        userDropdown.classList.remove("opacity-100");
        userDropdown.classList.add("opacity-0");
        userDropdown.style.pointerEvents = "none";
      } else {
        userDropdown.classList.add("opacity-100");
        userDropdown.classList.remove("opacity-0");
        userDropdown.style.pointerEvents = "auto";
      }
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", (e) => {
      if (
        !userProfileBtn.contains(e.target) &&
        !userDropdown.contains(e.target)
      ) {
        userDropdown.classList.remove("opacity-100");
        userDropdown.classList.add("opacity-0");
        userDropdown.style.pointerEvents = "none";
      }
    });
  }

  // Fullscreen toggle
  const fullscreenBtn = document.querySelector(
    'button[aria-label="Fullscreen"]'
  );
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
          );
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Placeholder for search button
  const searchBtn = document.querySelector('button[aria-label="Search"]');
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      alert("Search functionality is not implemented yet.");
    });
  }

  // Placeholder for notifications button
  const notificationsBtn = document.querySelector(
    'button[aria-label="Notifications"]'
  );
  if (notificationsBtn) {
    notificationsBtn.addEventListener("click", () => {
      alert("Notifications functionality is not implemented yet.");
    });
  }

  // Placeholder for messages button
  const messagesBtn = document.querySelector('button[aria-label="Messages"]');
  if (messagesBtn) {
    messagesBtn.addEventListener("click", () => {
      alert("Messages functionality is not implemented yet.");
    });
  }
});
