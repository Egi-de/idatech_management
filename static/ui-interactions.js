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

  // Remove placeholder alert for search button and allow form submission
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    // Optional: Add any custom JS if needed for search form submission
    // Currently, form submission will trigger default GET request to backend
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

  /**
   * Adds 'active' class to sidebar menu items based on current URL path or query parameter 'section'.
   */
  const sidebarLinks = document.querySelectorAll(
    "#sidebar nav ul li a.nav-btn"
  );
  const urlParams = new URLSearchParams(window.location.search);
  const currentSection = urlParams.get("section");
  const currentPath = window.location.pathname;

  sidebarLinks.forEach((link) => {
    const linkSection = link.getAttribute("data-section");
    const linkHref = link.getAttribute("href");

    // Remove existing active class
    link.classList.remove("active");
    const icon = link.querySelector("i");
    if (icon) {
      icon.classList.remove("text-white");
      icon.classList.add("text-blue-600");
    }

    // Determine if this link should be active
    if (currentSection && linkSection === currentSection) {
      link.classList.add("active");
      if (icon) {
        icon.classList.remove("text-blue-600");
        icon.classList.add("text-white");
      }
    } else if (!currentSection && linkHref === currentPath) {
      // If no section param, match by path
      link.classList.add("active");
      if (icon) {
        icon.classList.remove("text-blue-600");
        icon.classList.add("text-white");
      }
    }
  });

  // Filter buttons active state toggle for student management section
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("bg-blue-500", "text-white");
        btn.classList.add("bg-gray-200", "text-gray-700");
      });
      button.classList.add("bg-blue-500", "text-white");
      button.classList.remove("bg-gray-200", "text-gray-700");
    });
  });
});
