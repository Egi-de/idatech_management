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

  // Show the correct section based on URL param
  const sections = document.querySelectorAll(".section");
  sections.forEach((sec) => sec.classList.add("hidden"));
  const targetSection = currentSection || "overview";
  const target = document.getElementById(targetSection);
  if (target) target.classList.remove("hidden");

  // Filter buttons active state toggle for student management section
  const filterButtons = document.querySelectorAll(".filter-btn");
  const studentsTableBody = document.getElementById("students-table");

  // Add Employee button click handler
  const addEmployeeBtn = document.getElementById("add-employee-btn");
  if (addEmployeeBtn) {
    addEmployeeBtn.addEventListener("click", () => {
      // Redirect to the add employee page
      window.location.href = "/admin_panel/add-employee-form/";
    });
  }

  // Map plural filter values to singular backend filter keys
  const filterMap = {
    trainees: "trainee",
    internes: "internee",
    internees: "internee",
    iot: "iot",
    sod: "sod",
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Filter button clicked:", button.getAttribute("data-filter"));
      filterButtons.forEach((btn) => {
        btn.classList.remove("bg-blue-500", "text-white");
        btn.classList.add("bg-gray-200", "text-gray-700");
      });
      button.classList.add("bg-blue-500", "text-white");
      button.classList.remove("bg-gray-200", "text-gray-700");

      let filterType = button.getAttribute("data-filter");
      console.log("Original filterType:", filterType);

      if (filterType === "all") {
        // Reload the page or fetch all students
        window.location.href = window.location.pathname;
        return;
      }

      // Map plural to singular filter key
      filterType = filterMap[filterType] || filterType;
      console.log("Mapped filterType:", filterType);

      // Fetch filtered students via AJAX
      fetch(`/fetch-tab-data/${filterType}/`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((response) => {
          console.log("Fetch response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("Data received:", data);
          // Clear current table rows
          studentsTableBody.innerHTML = "";

          if (data.data.length === 0) {
            const noDataRow = document.createElement("tr");
            noDataRow.innerHTML = `<td colspan="7" class="text-center py-4">No students found.</td>`;
            studentsTableBody.appendChild(noDataRow);
            return;
          }

          // Populate table with filtered students
          data.data.forEach((student) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">${student.type}</td>
              <td class="px-6 py-4 whitespace-nowrap">${student.address}</td>
              <td class="px-6 py-4 whitespace-nowrap">${student.program}</td>
              <td class="px-6 py-4 whitespace-nowrap">${student.level}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a href="/admin_panel/update_student/${
                  student.id
                }/" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</a>
                <form action="/admin_panel/delete_student/${
                  student.id
                }/" method="post" class="inline">
                  <input type="hidden" name="csrfmiddlewaretoken" value="${getCookie(
                    "csrftoken"
                  )}">
                  <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Are you sure you want to delete this student?');">Delete</button>
                </form>
                <button type="button" class="select-btn text-blue-600 hover:text-blue-900 ml-2">Select</button>
              </td>
            `;
            studentsTableBody.appendChild(row);
          });
        })
        .catch((error) => {
          console.error("Error fetching filtered students:", error);
        });
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
  const deleteSelectedBtn = document.getElementById(
    "delete-selected-students-btn"
  );
  const selectAllCheckbox = document.getElementById("select-all-students");
  const studentCheckboxes = document.querySelectorAll(".student-checkbox");
  const checkboxCells = document.querySelectorAll(".checkbox-cell");

  let selectionMode = false;

  function updateDeleteButtonState() {
    const anyChecked = Array.from(studentCheckboxes).some((cb) => cb.checked);
    if (deleteSelectedBtn) {
      deleteSelectedBtn.disabled = !anyChecked;
      if (anyChecked) {
        deleteSelectedBtn.classList.remove("disabled", "opacity-50", "hidden");
      } else {
        deleteSelectedBtn.classList.add("disabled", "opacity-50", "hidden");
      }
    }
  }

  selectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectionMode = !selectionMode;
      checkboxCells.forEach((cell) => {
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
        studentCheckboxes.forEach((cb) => (cb.checked = false));
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
      }
      updateDeleteButtonState();
    });
  });

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", () => {
      const checked = selectAllCheckbox.checked;
      studentCheckboxes.forEach((cb) => (cb.checked = checked));
      updateDeleteButtonState();
    });
  }

  studentCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      if (selectAllCheckbox) {
        const allChecked = Array.from(studentCheckboxes).every(
          (cb) => cb.checked
        );
        selectAllCheckbox.checked = allChecked;
      }
      updateDeleteButtonState();
    });
  });

  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener("click", function () {
      const selectedIds = Array.from(studentCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedIds.length === 0) {
        alert("Please select at least one student to delete.");
        return;
      }

      if (
        !confirm(
          `Are you sure you want to delete ${selectedIds.length} selected student(s)?`
        )
      ) {
        return;
      }

      fetch("/bulk-delete-students/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ student_ids: selectedIds }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            // Reload page or remove deleted rows from DOM
            location.reload();
          } else {
            alert(
              "Failed to delete selected students: " +
                (data.error || "Unknown error")
            );
          }
        })
        .catch((error) => {
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
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Employee Section Enhancements

  // Real-time search with autocomplete for employees
  const employeeSearchInput = document.getElementById("employee-search");
  const employeeSearchResults = document.getElementById(
    "employee-search-results"
  );
  let searchTimeout;

  if (employeeSearchInput && employeeSearchResults) {
    employeeSearchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      const query = this.value.trim();

      if (query.length < 2) {
        employeeSearchResults.classList.add("hidden");
        return;
      }

      searchTimeout = setTimeout(() => {
        fetch(
          `/admin_panel/search/?q=${encodeURIComponent(query)}&type=employee`,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            employeeSearchResults.innerHTML = "";
            if (data.employees && data.employees.length > 0) {
              data.employees.forEach((employee) => {
                const resultItem = document.createElement("div");
                resultItem.className = "p-2 hover:bg-gray-100 cursor-pointer";
                resultItem.textContent = `${employee.first_name} ${employee.last_name} - ${employee.position}`;
                resultItem.addEventListener("click", () => {
                  employeeSearchInput.value = `${employee.first_name} ${employee.last_name}`;
                  employeeSearchResults.classList.add("hidden");
                  // Optionally, filter the employee list to show only this employee
                  filterEmployees({
                    search: employee.first_name + " " + employee.last_name,
                  });
                });
                employeeSearchResults.appendChild(resultItem);
              });
              employeeSearchResults.classList.remove("hidden");
            } else {
              employeeSearchResults.classList.add("hidden");
            }
          })
          .catch((error) => {
            console.error("Error searching employees:", error);
            employeeSearchResults.classList.add("hidden");
          });
      }, 300);
    });

    // Hide search results when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !employeeSearchInput.contains(e.target) &&
        !employeeSearchResults.contains(e.target)
      ) {
        employeeSearchResults.classList.add("hidden");
      }
    });
  }

  // Employee filtering and sorting
  const employeeDepartmentFilter = document.getElementById(
    "employee-department-filter"
  );
  const employeeStatusFilter = document.getElementById(
    "employee-status-filter"
  );
  const employeeSortSelect = document.getElementById("employee-sort");
  const employeeTableBody = document.getElementById("employees-table");
  const employeeLoadingSpinner = document.getElementById("employees-loading");

  function filterEmployees(params = {}) {
    const department =
      params.department ||
      (employeeDepartmentFilter ? employeeDepartmentFilter.value : "");
    const status =
      params.status || (employeeStatusFilter ? employeeStatusFilter.value : "");
    const sort =
      params.sort ||
      (employeeSortSelect ? employeeSortSelect.value : "name_asc");
    const search =
      params.search || (employeeSearchInput ? employeeSearchInput.value : "");

    // Show loading spinner
    if (employeeLoadingSpinner)
      employeeLoadingSpinner.classList.remove("hidden");
    if (employeeTableBody) employeeTableBody.classList.add("opacity-50");

    const queryParams = new URLSearchParams({
      employee_department: department,
      employee_status: status,
      employee_sort: sort,
      employee_search: search,
    });

    fetch(`/admin_panel/dashboard/?${queryParams}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update employee table with filtered results
        if (employeeTableBody && data.employees_html) {
          employeeTableBody.innerHTML = data.employees_html;
        }
        // Hide loading spinner
        if (employeeLoadingSpinner)
          employeeLoadingSpinner.classList.add("hidden");
        if (employeeTableBody) employeeTableBody.classList.remove("opacity-50");
      })
      .catch((error) => {
        console.error("Error filtering employees:", error);
        if (employeeLoadingSpinner)
          employeeLoadingSpinner.classList.add("hidden");
        if (employeeTableBody) employeeTableBody.classList.remove("opacity-50");
        showErrorMessage("Failed to filter employees. Please try again.");
      });
  }

  // Event listeners for filters
  if (employeeDepartmentFilter) {
    employeeDepartmentFilter.addEventListener("change", () =>
      filterEmployees()
    );
  }
  if (employeeStatusFilter) {
    employeeStatusFilter.addEventListener("change", () => filterEmployees());
  }
  if (employeeSortSelect) {
    employeeSortSelect.addEventListener("change", () => filterEmployees());
  }

  // Employee bulk operations
  const employeeSelectAllCheckbox = document.getElementById(
    "select-all-employees-checkbox"
  );
  const employeeCheckboxes = document.querySelectorAll(".employee-checkbox");
  const employeeBulkDeleteBtn = document.getElementById(
    "bulk-delete-employees"
  );
  const employeeBulkEditBtn = document.getElementById("bulk-edit-employees");
  const employeeExportBtn = document.getElementById("export-employees");

  function updateEmployeeBulkButtons() {
    const checkedBoxes = document.querySelectorAll(
      ".employee-checkbox:checked"
    );
    const hasSelection = checkedBoxes.length > 0;

    if (employeeBulkDeleteBtn) {
      employeeBulkDeleteBtn.disabled = !hasSelection;
      employeeBulkDeleteBtn.classList.toggle("opacity-50", !hasSelection);
    }
    if (employeeBulkEditBtn) {
      employeeBulkEditBtn.disabled = !hasSelection;
      employeeBulkEditBtn.classList.toggle("opacity-50", !hasSelection);
    }
  }

  if (employeeSelectAllCheckbox) {
    employeeSelectAllCheckbox.addEventListener("change", function () {
      const isChecked = this.checked;
      employeeCheckboxes.forEach((cb) => (cb.checked = isChecked));
      updateEmployeeBulkButtons();
    });
  }

  employeeCheckboxes.forEach((cb) => {
    cb.addEventListener("change", function () {
      const allChecked = Array.from(employeeCheckboxes).every(
        (cb) => cb.checked
      );
      const noneChecked = Array.from(employeeCheckboxes).every(
        (cb) => !cb.checked
      );

      if (employeeSelectAllCheckbox) {
        employeeSelectAllCheckbox.checked = allChecked;
        employeeSelectAllCheckbox.indeterminate = !allChecked && !noneChecked;
      }
      updateEmployeeBulkButtons();
    });
  });

  // Bulk delete employees
  if (employeeBulkDeleteBtn) {
    employeeBulkDeleteBtn.addEventListener("click", function () {
      const selectedIds = Array.from(employeeCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedIds.length === 0) {
        showErrorMessage("Please select employees to delete.");
        return;
      }

      if (
        !confirm(
          `Are you sure you want to delete ${selectedIds.length} employee(s)?`
        )
      ) {
        return;
      }

      // Show loading state
      this.disabled = true;
      this.textContent = "Deleting...";

      fetch("/bulk-delete-employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ employee_ids: selectedIds }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            location.reload(); // Refresh to show updated list
          } else {
            showErrorMessage(data.error || "Failed to delete employees.");
          }
        })
        .catch((error) => {
          console.error("Error deleting employees:", error);
          showErrorMessage("Failed to delete employees. Please try again.");
        })
        .finally(() => {
          this.disabled = false;
          this.textContent = "Delete Selected";
        });
    });
  }

  // Bulk edit employees (placeholder for future implementation)
  if (employeeBulkEditBtn) {
    employeeBulkEditBtn.addEventListener("click", function () {
      const selectedIds = Array.from(employeeCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedIds.length === 0) {
        showErrorMessage("Please select employees to edit.");
        return;
      }

      // For now, just show an alert. In a full implementation, this would open a bulk edit modal
      alert("Bulk edit functionality will be implemented in the next update.");
    });
  }

  // Export employees
  if (employeeExportBtn) {
    employeeExportBtn.addEventListener("click", function () {
      const department = employeeDepartmentFilter
        ? employeeDepartmentFilter.value
        : "";
      const status = employeeStatusFilter ? employeeStatusFilter.value : "";
      const sort = employeeSortSelect ? employeeSortSelect.value : "name_asc";
      const search = employeeSearchInput ? employeeSearchInput.value : "";

      const queryParams = new URLSearchParams({
        employee_department: department,
        employee_status: status,
        employee_sort: sort,
        employee_search: search,
        export: "true",
      });

      window.open(`/admin_panel/dashboard/?${queryParams}`, "_blank");
    });
  }

  // Employee pagination
  const employeePagination = document.getElementById("employee-pagination");
  const employeePrevBtn = document.getElementById("employee-prev-btn");
  const employeeNextBtn = document.getElementById("employee-next-btn");
  const employeePageInfo = document.getElementById("employee-page-info");

  let currentEmployeePage = 1;
  const employeesPerPage = 10;

  function updateEmployeePagination(totalEmployees) {
    if (!employeePagination) return;

    const totalPages = Math.ceil(totalEmployees / employeesPerPage);

    if (employeePrevBtn) {
      employeePrevBtn.disabled = currentEmployeePage === 1;
    }
    if (employeeNextBtn) {
      employeeNextBtn.disabled = currentEmployeePage === totalPages;
    }
    if (employeePageInfo) {
      employeePageInfo.textContent = `Page ${currentEmployeePage} of ${totalPages}`;
    }
  }

  if (employeePrevBtn) {
    employeePrevBtn.addEventListener("click", () => {
      if (currentEmployeePage > 1) {
        currentEmployeePage--;
        filterEmployees({ page: currentEmployeePage });
      }
    });
  }

  if (employeeNextBtn) {
    employeeNextBtn.addEventListener("click", () => {
      currentEmployeePage++;
      filterEmployees({ page: currentEmployeePage });
    });
  }

  // Error message display function
  function showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50";
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Success message display function
  function showSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.className =
      "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }
});
