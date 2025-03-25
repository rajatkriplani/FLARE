document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide
  lucide.createIcons()

  // Get DOM elements
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("main-content")
  const navLinks = document.querySelectorAll(".nav-link")
  const pageSections = document.querySelectorAll(".page-section")
  const resetButton = document.getElementById("resetButton")
  const openCameraButton = document.getElementById("open-camera")
  const cameraContainer = document.getElementById("camera-container")
  const qrVideo = document.getElementById("qr-video")
  const toggleInputs = document.querySelectorAll(".toggle-input")
  const dropZones = document.querySelectorAll(".drop-zone")
  const buttons = document.querySelectorAll(".btn-primary, .btn-danger, .btn-secondary")

  // Function to update active navigation link
  function updateActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-section")
      if (linkSection === sectionId) {
        link.classList.add("bg-blue-700", "text-white")
        link.classList.remove("text-gray-300", "hover:bg-gray-800")
        link.setAttribute("aria-current", "page")
      } else {
        link.classList.remove("bg-blue-700", "text-white")
        link.classList.add("text-gray-300", "hover:bg-gray-800")
        link.removeAttribute("aria-current")
      }
    })
  }

  // Function to show page section
  function showPageSection(sectionId) {
    pageSections.forEach((section) => {
      section.classList.add("hidden")
    })
    const sectionToShow = document.getElementById(`${sectionId}-section`)
    if (sectionToShow) {
      sectionToShow.classList.remove("hidden")
      document.title = `FLARE - ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`
    }
    updateActiveNavLink(sectionId)
  }

  // Navigation links event listeners
  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault()
      const sectionId = this.getAttribute("data-section")
      showPageSection(sectionId)
      window.location.hash = `#${sectionId}`

      // Add ripple effect
      const ripple = document.createElement("span")
      ripple.classList.add("nav-ripple")
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Initial page load
  function loadInitialSection() {
    const hash = window.location.hash.substring(1)
    const initialSection = hash || "dashboard"
    showPageSection(initialSection)
  }

  loadInitialSection()

  // Handle browser back/forward navigation
  window.addEventListener("hashchange", loadInitialSection)

  // Sidebar hover functionality
  let sidebarTimeout

  sidebar.addEventListener("mouseenter", () => {
    clearTimeout(sidebarTimeout)
    sidebar.classList.remove("w-20")
    sidebar.classList.add("w-64")
    mainContent.classList.remove("ml-20")
    mainContent.classList.add("ml-64")
  })

  sidebar.addEventListener("mouseleave", () => {
    sidebarTimeout = setTimeout(() => {
      sidebar.classList.remove("w-64")
      sidebar.classList.add("w-20")
      mainContent.classList.remove("ml-64")
      mainContent.classList.add("ml-20")
    }, 300)
  })

  // Reset button functionality
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const now = new Date().toLocaleString()
      document.getElementById("lastResetTime").textContent = now
      alert("Simulating Liquid Galaxy Rig Re-launch. Timestamp updated.")
    })
  }

  // Camera functionality
  if (openCameraButton) {
    openCameraButton.addEventListener("click", () => {
      if (cameraContainer.classList.contains("hidden")) {
        cameraContainer.classList.remove("hidden")

        // Request camera access
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
              qrVideo.srcObject = stream
              qrVideo.play()
              alert("Camera opened. In a real implementation, this would scan for QR codes.")
            })
            .catch((error) => {
              console.error("Error accessing camera:", error)
              alert("Could not access camera. Please check permissions.")
              cameraContainer.classList.add("hidden")
            })
        } else {
          alert("Your browser does not support camera access.")
          cameraContainer.classList.add("hidden")
        }
      } else {
        // Stop camera stream
        if (qrVideo.srcObject) {
          const tracks = qrVideo.srcObject.getTracks()
          tracks.forEach((track) => track.stop())
          qrVideo.srcObject = null
        }
        cameraContainer.classList.add("hidden")
      }
    })
  }

  // Toggle switch functionality
  toggleInputs.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const dot = this.parentNode.querySelector(".dot")
      if (this.checked) {
        dot.classList.add("transform", "bg-blue-600")
      } else {
        dot.classList.remove("transform", "bg-blue-600")
      }
    })
  })

  // Range input background fill
  function handleRangeInput(input) {
    const min = input.min ? Number.parseFloat(input.min) : 0
    const max = input.max ? Number.parseFloat(input.max) : 100
    const val = Number.parseFloat(input.value)
    const percentage = ((val - min) / (max - min)) * 100

    input.style.backgroundSize = `${percentage}% 100%`
  }

  // rangeInputs.forEach((input) => {
  //   handleRangeInput(input)
  //   input.addEventListener("input", () => {
  //     handleRangeInput(input)
  //   })
  // })

  // File upload handling
  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault()
      zone.classList.add("border-blue-500", "bg-blue-50")
    })

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("border-blue-500", "bg-blue-50")
    })

    zone.addEventListener("drop", (e) => {
      e.preventDefault()
      zone.classList.remove("border-blue-500", "bg-blue-50")

      // Handle file upload logic
      const files = e.dataTransfer.files
      if (files.length) {
        // Display file name or process the file
        alert(`File dropped: ${files[0].name}`)
      }
    })

    // Also handle click to browse files
    zone.addEventListener("click", () => {
      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.accept = ".csv"
      fileInput.style.display = "none"

      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
          // Handle the selected file
          alert(`File selected: ${e.target.files[0].name}`)
        }
      })

      document.body.appendChild(fileInput)
      fileInput.click()
      document.body.removeChild(fileInput)
    })
  })

  // Button ripple effect
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement("span")
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.classList.add("ripple")

      button.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})

