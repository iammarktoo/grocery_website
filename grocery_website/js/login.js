// Modal functionality
const modal = document.getElementById("signupModal");
const openBtn = document.getElementById("openSignup");
const closeBtn = document.getElementById("closeModal");

openBtn?.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Login functionality
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("loginModal");
    const closeBtn = document.getElementById("closeLoginModal");

    // Show login modal only once per session
    if (!sessionStorage.getItem("loginShown")) {
        modal.style.display = "flex";
        sessionStorage.setItem("loginShown", "true");
    }

    // Close modal when clicking the 'x'
    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    // Close modal when clicking outside the content
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
});

// Login form submission
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("password")?.value;

    fetch("login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                // Save userID to sessionStorage
                sessionStorage.setItem("userID", data.userID);
        
                alert("Login successful!");
                document.getElementById("loginModal").style.display = "none";
                window.location.reload(); // or navigate if needed

                // After successful login
                localStorage.setItem("currentUser", JSON.stringify({
                    userID: data.userID, // or data.email
                    fullName: data.fullName
                }));
            } else {
                alert("Login failed: " + (data.error || "Unknown error"));
            }
        })
        .catch((err) => {
            console.error("Error during login:", err);
            alert("An error occurred. Please try again.");
        });
});