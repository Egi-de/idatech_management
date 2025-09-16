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
        icon.classList.remove("text-white");
        icon.classList.add("text-blue-600");
      }
    } else if (!currentSection && linkHref === currentPath) {
      // If no section param, match by path
      link.classList.add("active");
      if (icon) {
        icon.classList.remove("text-white");
        icon.classList.add("text-blue-600");
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

  // Report buttons functionality
  const reportButtons = document.querySelectorAll(".report-btn");
  const reportSections = document.querySelectorAll(".report-section");
  const reportContent = document.getElementById("report-content");

  function clearReportButtonActiveStates() {
    reportButtons.forEach((btn) => {
      btn.classList.remove("opacity-75");
      btn.classList.remove("hover:bg-blue-600");
      // Remove any added active background classes
      btn.classList.remove("bg-blue-600");
      btn.classList.remove("bg-green-600");
      btn.classList.remove("bg-purple-600");
    });
  }

  function setActiveReportButton(button) {
    clearReportButtonActiveStates();
    button.classList.add("opacity-75");
    // Add active background color based on original button color
    if (button.classList.contains("bg-blue-500")) {
      button.classList.add("bg-blue-600");
    } else if (button.classList.contains("bg-green-500")) {
      button.classList.add("bg-green-600");
    } else if (button.classList.contains("bg-purple-500")) {
      button.classList.add("bg-purple-600");
    }
    button.classList.remove("hover:bg-blue-600");
  }

  function showReportSection(reportType) {
    // Hide all report sections and show the default content
    reportSections.forEach((section) => {
      section.classList.add("hidden");
    });
    if (reportContent) {
      reportContent.classList.add("hidden");
    }

    // Show the selected report section
    const targetSection = document.getElementById(`${reportType}-report`);
    if (targetSection) {
      targetSection.classList.remove("hidden");
    }
  }

  reportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const reportType = button.getAttribute("data-report");
      showReportSection(reportType);
      setActiveReportButton(button);
    });
  });

  // Show the first report (students) by default on page load
  if (reportButtons.length > 0) {
    const firstButton = reportButtons[0];
    showReportSection(firstButton.getAttribute("data-report"));
    setActiveReportButton(firstButton);
  }

  // Select button toggle checkboxes and delete selected button
  const selectButtons = document.querySelectorAll(".select-btn");
  const deleteSelectedBtn = document.getElementById("delete-selected-students-btn");
  const selectAllCheckbox = document.getElementById("select-all-students");
  const studentCheckboxes = document.querySelectorAll(".student-checkbox");
  const checkboxCells = document.querySelectorAll(".checkbox-cell");

  let selectionMode = false;

  function updateDeleteButtonState() {
    const anyChecked = Array.from(studentCheckboxes).some(cb => cb.checked);
    if (deleteSelectedBtn) {
      deleteSelectedBtn.disabled = !anyChecked;
      if (anyChecked) {
        deleteSelectedBtn.classList.remove("disabled", "opacity-50", "hidden");
      } else {
        deleteSelectedBtn.classList.add("disabled", "opacity-50", "hidden");
      }
    }
  }

  selectButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectionMode = !selectionMode;
      checkboxCells.forEach(cell => {
        if (selectionMode) {
          cell.classList.remove("hidden");
        } else {
          cell.classList.add("hidden");
        }
      });
      if (deleteSelectedBtn) {
        deleteSelectedBtn.classList.toggle("hidden", !selectionMode);
        deleteSelectedBtn.disabled = !selectionMode;
      }
      if (!selectionMode) {
        studentCheckboxes.forEach(cb => cb.checked = false);
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
      }
      updateDeleteButtonState();
    });
  });

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", () => {
      const checked = selectAllCheckbox.checked;
      studentCheckboxes.forEach(cb => cb.checked = checked);
      updateDeleteButtonState();
    });
  }

  studentCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      if (selectAllCheckbox) {
        const allChecked = Array.from(studentCheckboxes).every(cb => cb.checked);
        selectAllCheckbox.checked = allChecked;
      }
      updateDeleteButtonState();
    });
  });

  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener("click", function () {
      const selectedIds = Array.from(studentCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      if (selectedIds.length === 0) {
        alert("Please select at least one student to delete.");
        return;
      }

      if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected student(s)?`)) {
        return;
      }

      fetch("/bulk-delete-students/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ student_ids: selectedIds }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            // Reload page or remove deleted rows from DOM
            location.reload();
          } else {
            alert("Failed to delete selected students: " + (data.error || "Unknown error"));
          }
        })
        .catch(error => {
          alert("Error deleting students: " + error.message);
        });
    });
  }

  // Helper function to get CSRF token cookie
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});
