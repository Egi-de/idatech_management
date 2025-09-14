document.addEventListener("DOMContentLoaded", function () {
  // Navigation button handling
  const navButtons = document.querySelectorAll(".nav-btn");

  // Restore active section from localStorage
  const savedSection = localStorage.getItem("activeSection");
  if (savedSection) {
    const sectionToShow = document.getElementById(savedSection);
    if (sectionToShow) {
      // Hide all sections
      document.querySelectorAll(".section").forEach((section) => {
        section.classList.add("hidden");
      });
      sectionToShow.classList.remove("hidden");

      // Update nav button styles
      navButtons.forEach((b) => {
        b.classList.remove("bg-primaryBlue-light", "text-primaryBlue");
        b.classList.add("hover:bg-primaryBlue-light");
      });
      const activeBtn = document.querySelector(
        `.nav-btn[data-section="${savedSection}"]`
      );
      if (activeBtn) {
        activeBtn.classList.add("bg-primaryBlue-light", "text-primaryBlue");
        activeBtn.classList.remove("hover:bg-primaryBlue-light");
      }
    }
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => {
        b.classList.remove("bg-primaryBlue-light", "text-primaryBlue");
        b.classList.add("hover:bg-primaryBlue-light");
      });
      btn.classList.add("bg-primaryBlue-light", "text-primaryBlue");
      btn.classList.remove("hover:bg-primaryBlue-light");

      document.querySelectorAll(".section").forEach((section) => {
        section.classList.add("hidden");
      });
      const sectionId = btn.getAttribute("data-section");
      const sectionToShow = document.getElementById(sectionId);
      if (sectionToShow) {
        sectionToShow.classList.remove("hidden");
      }

      // Save active section to localStorage
      localStorage.setItem("activeSection", sectionId);
    });
  });

  // Modal handling for Add Student
  const addStudentBtn = document.getElementById("add-student-btn");
  const studentModal = document.getElementById("student-modal");
  const cancelStudentBtn = document.getElementById("cancel-student");
  const studentForm = document.getElementById("student-form");
  const studentModalTitle = studentModal.querySelector("h3");
  const studentSubmitBtn = studentForm.querySelector("button[type='submit']");

  addStudentBtn.addEventListener("click", () => {
    studentForm.reset();
    studentModalTitle.textContent = "Add Student";
    studentSubmitBtn.textContent = "Add Student";
    studentForm.setAttribute("data-mode", "add");
    studentForm.removeAttribute("data-id");
    studentForm.action = "/add-student/";
    studentModal.classList.remove("hidden");
    studentModal.classList.add("flex");
  });

  cancelStudentBtn.addEventListener("click", () => {
    studentModal.classList.add("hidden");
    studentModal.classList.remove("flex");
  });

  // Intercept Edit Student links
  document
    .querySelectorAll("#students-table a[href^='/update-student/']")
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const url = this.getAttribute("href");
        const studentId = url.match(/\/update-student\/(\d+)\//)[1];
        // Find the student row
        const row = this.closest("tr");
        // Pre-fill form fields
        studentForm["student-name"].value = row.children[0].textContent.trim();
        studentForm["student-type"].value = row.children[1].textContent
          .trim()
          .toLowerCase()
          .replace(/\s/g, "-");
        studentForm["student-program"].value = row.children[3].textContent
          .trim()
          .toLowerCase();
        studentForm["student-level"].value = row.children[4].textContent.trim();

        studentModalTitle.textContent = "Update Student";
        studentSubmitBtn.textContent = "Update Student";
        studentForm.setAttribute("data-mode", "update");
        studentForm.setAttribute("data-id", studentId);
        studentForm.action = url;

        studentModal.classList.remove("hidden");
        studentModal.classList.add("flex");
      });
    });

  // AJAX form submission for Add/Update Student
  studentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const mode = studentForm.getAttribute("data-mode");
    const url = studentForm.action;
    const formData = new FormData(studentForm);
    fetch(url, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update counts if add
          if (mode === "add") {
            document.getElementById("total-students").textContent =
              data.counts.total_students;
            document.getElementById("iot-students").textContent =
              data.counts.iot_students;
            document.getElementById("sod-students").textContent =
              data.counts.sod_students;

            // Add new student row to table
            const studentsTable = document.getElementById("students-table");
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap">${data.student.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.student.type}</td>
              <td class="px-6 py-4 whitespace-nowrap">${
                data.student.category
              }</td>
              <td class="px-6 py-4 whitespace-nowrap">${
                data.student.program
              }</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.student.level}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a href="/update-student/${
                  data.student.id
                }/" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</a>
                <form action="/delete-student/${
                  data.student.id
                }/" method="post" class="inline">
                  <input type="hidden" name="csrfmiddlewaretoken" value="${getCookie(
                    "csrftoken"
                  )}">
                  <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Are you sure you want to delete this student?');">Delete</button>
                </form>
              </td>
            `;
            studentsTable.appendChild(newRow);
          } else if (mode === "update") {
            // Update existing row
            const studentId = studentForm.getAttribute("data-id");
            const rows = document.querySelectorAll("#students-table tr");
            rows.forEach((row) => {
              const editLink = row.querySelector(
                `a[href='/update-student/${studentId}/']`
              );
              if (editLink) {
                row.children[0].textContent = data.student.name;
                row.children[1].textContent = data.student.type;
                row.children[2].textContent = data.student.category;
                row.children[3].textContent = data.student.program;
                row.children[4].textContent = data.student.level;
              }
            });
          }
          // Close modal and reset form
          studentModal.classList.add("hidden");
          studentModal.classList.remove("flex");
          studentForm.reset();
        } else {
          alert("Failed to submit student data.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred.");
      });
  });

  // Helper function to get CSRF token from cookies
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

  // Financial Management: AJAX form submission for Add Expense
  const expenseForm = document.getElementById("expense-form");
  if (expenseForm) {
    expenseForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(expenseForm);
      fetch("/admin_panel/add-expense/", {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update financial summary counts dynamically
            document.getElementById(
              "total-salaries"
            ).textContent = `$${data.total_salaries}`;
            document.getElementById(
              "transport-expenses"
            ).textContent = `$${data.transport_expenses}`;
            document.getElementById(
              "other-expenses"
            ).textContent = `$${data.other_expenses}`;
            document.getElementById(
              "total-expenses"
            ).textContent = `$${data.total_expenses}`;

            // Optionally, refresh recent transactions table
            loadRecentTransactions();

            // Reset form
            expenseForm.reset();
          } else {
            alert("Failed to add expense.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while adding expense.");
        });
    });
  }

  // Function to load recent transactions dynamically
  function loadRecentTransactions() {
    fetch("/admin_panel/recent-transactions/")
      .then((response) => response.json())
      .then((data) => {
        const transactionsTable = document.getElementById("transactions-table");
        transactionsTable.innerHTML = "";
        data.transactions.forEach((tx) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="py-2">${tx.date}</td>
            <td class="py-2">${tx.type}</td>
            <td class="py-2">${tx.description}</td>
            <td class="py-2 text-right">$${tx.amount}</td>
          `;
          transactionsTable.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error loading recent transactions:", error);
      });
  }

  // Initial load of recent transactions on page load
  loadRecentTransactions();

  // Filtering students by type and program with search integration
  const filterButtons = document.querySelectorAll(".filter-btn");
  const studentRows = document.querySelectorAll("#students-table tr");
  const studentSearchInput = document.getElementById("student-search");

  let currentFilter = "all";

  function applyFilters() {
    const query = studentSearchInput
      ? studentSearchInput.value.toLowerCase()
      : "";
    studentRows.forEach((row) => {
      const typeCell = row.querySelector("td:nth-child(2)");
      const programCell = row.querySelector("td:nth-child(4)");
      const nameCell = row.querySelector("td:nth-child(1)");
      if (!nameCell || !typeCell || !programCell) {
        row.style.display = "none";
        return;
      }

      // Filter by type/program
      let filterMatch = false;
      if (currentFilter === "all") {
        filterMatch = true;
      } else if (
        currentFilter === "trainees" &&
        typeCell.textContent.trim() === "trainee"
      ) {
        filterMatch = true;
      } else if (
        currentFilter === "internees" &&
        (typeCell.textContent.trim() === "internee-university" ||
          typeCell.textContent.trim() === "internee-highschool")
      ) {
        filterMatch = true;
      } else if (
        currentFilter === "iot" &&
        programCell.textContent.trim() === "iot"
      ) {
        filterMatch = true;
      } else if (
        currentFilter === "sod" &&
        programCell.textContent.trim() === "sod"
      ) {
        filterMatch = true;
      }

      // Filter by search query
      const nameText = nameCell.textContent.toLowerCase();
      const searchMatch = nameText.includes(query);

      if (filterMatch && searchMatch) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("bg-primaryBlue", "text-white");
        b.classList.add("bg-coolGray");
      });
      btn.classList.add("bg-primaryBlue", "text-white");
      btn.classList.remove("bg-coolGray");

      currentFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });

  if (studentSearchInput) {
    studentSearchInput.addEventListener("input", () => {
      applyFilters();
    });
  }

  // Search functionality for Employees section
  const employeeSearchInput = document.getElementById("employee-search");
  const employeeRows = document.querySelectorAll("#employees-table tr");

  if (employeeSearchInput) {
    employeeSearchInput.addEventListener("input", () => {
      const query = employeeSearchInput.value.toLowerCase();
      employeeRows.forEach((row) => {
        const nameCell = row.querySelector("td:nth-child(1)");
        if (nameCell) {
          const name = nameCell.textContent.toLowerCase();
          if (name.includes(query)) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        }
      });
    });
  }

  // Intercept Edit Employee links
  document
    .querySelectorAll("#employees-table a[href^='/update-employee/']")
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const url = this.getAttribute("href");
        const employeeIdMatch = url.match(/\/update-employee\/(\d+)/);
        if (!employeeIdMatch) {
          console.error("Invalid employee update URL:", url);
          return;
        }
        const employeeId = employeeIdMatch[1];
        // Find the employee row
        const row = this.closest("tr");
        if (!row) {
          console.error("Employee row not found for update link.");
          return;
        }
        // Pre-fill form fields
        const employeeForm = document.getElementById("employee-form");
        employeeForm["employee-name"].value =
          row.children[0].textContent.trim();
        employeeForm["employee-position"].value =
          row.children[1].textContent.trim();
        employeeForm["employee-department"].value =
          row.children[2].textContent.trim();
        employeeForm["employee-salary"].value = row.children[3].textContent
          .trim()
          .replace("$", "");

        const employeeModal = document.getElementById("employee-modal");
        const employeeModalTitle = employeeModal.querySelector("h3");
        const employeeSubmitBtn = employeeForm.querySelector(
          "button[type='submit']"
        );

        employeeModalTitle.textContent = "Update Employee";
        employeeSubmitBtn.textContent = "Update Employee";
        employeeForm.setAttribute("data-mode", "update");
        employeeForm.setAttribute("data-id", employeeId);
        employeeForm.action = url;

        employeeModal.classList.remove("hidden");
        employeeModal.classList.add("flex");
      });
    });

  // AJAX form submission for Add/Update Employee
  const employeeForm = document.getElementById("employee-form");
  const employeeModal = document.getElementById("employee-modal");
  const cancelEmployeeBtn = document.getElementById("cancel-employee");

  cancelEmployeeBtn.addEventListener("click", () => {
    employeeModal.classList.add("hidden");
    employeeModal.classList.remove("flex");
  });

  employeeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const mode = employeeForm.getAttribute("data-mode");
    const url = employeeForm.action;
    const formData = new FormData(employeeForm);
    fetch(url, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          if (mode === "add") {
            // Update counts
            document.getElementById("total-employees").textContent =
              data.counts.total_employees;

            // Add new employee row to table
            const employeesTable = document.getElementById("employees-table");
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap">${data.employee.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">${
                data.employee.position
              }</td>
              <td class="px-6 py-4 whitespace-nowrap">${
                data.employee.department
              }</td>
              <td class="px-6 py-4 whitespace-nowrap">${
                data.employee.salary
              }</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a href="/update-employee/${
                  data.employee.id
                }/" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</a>
                <form action="/delete-employee/${
                  data.employee.id
                }/" method="post" class="inline">
                  <input type="hidden" name="csrfmiddlewaretoken" value="${getCookie(
                    "csrftoken"
                  )}">
                  <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Are you sure you want to delete this employee?');">Delete</button>
                </form>
              </td>
            `;
            employeesTable.appendChild(newRow);
          } else if (mode === "update") {
            // Update existing row
            const employeeId = employeeForm.getAttribute("data-id");
            const rows = document.querySelectorAll("#employees-table tr");
            rows.forEach((row) => {
              const editLink = row.querySelector(
                `a[href='/update-employee/${employeeId}/']`
              );
              if (editLink) {
                row.children[0].textContent = data.employee.name;
                row.children[1].textContent = data.employee.position;
                row.children[2].textContent = data.employee.department;
                row.children[3].textContent = data.employee.salary;
              }
            });
          }
          // Close modal and reset form
          employeeModal.classList.add("hidden");
          employeeModal.classList.remove("flex");
          employeeForm.reset();
        } else {
          alert("Failed to submit employee data.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred.");
      });
  });

  // Helper function to get CSRF token from cookies
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

  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");

  if (sidebarToggle && sidebar && mainContent) {
    // Restore sidebar state from localStorage
    const sidebarCollapsed =
      localStorage.getItem("sidebarCollapsed") === "true";
    if (sidebarCollapsed) {
      sidebar.classList.add("collapsed");
      mainContent.classList.add("collapsed");
    }

    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("collapsed");

      // Toggle collapsed class on nav for margin adjustment
      const nav = document.querySelector("nav");
      if (nav) {
        nav.classList.toggle("collapsed");
      }

      // Save state to localStorage
      const isCollapsed = sidebar.classList.contains("collapsed");
      localStorage.setItem("sidebarCollapsed", isCollapsed);
    });

    // On page load, also toggle nav collapsed class based on localStorage
    const nav = document.querySelector("nav");
    if (nav) {
      const sidebarCollapsed =
        localStorage.getItem("sidebarCollapsed") === "true";
      if (sidebarCollapsed) {
        nav.classList.add("collapsed");
      } else {
        nav.classList.remove("collapsed");
      }
    }
  }
});
