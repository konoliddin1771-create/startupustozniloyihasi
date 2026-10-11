"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            menuBtn.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuBtn.textContent = "☰";
            });
        });
    }


    /* =========================
       DARK / LIGHT MODE
    ========================= */

    const themeBtn = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem("startup-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
        themeBtn.textContent = "☀️";
    }

    themeBtn?.addEventListener("click", () => {

        document.body.classList.toggle("light");

        const isLight = document.body.classList.contains("light");

        themeBtn.textContent = isLight ? "☀️" : "🌙";

        localStorage.setItem(
            "startup-theme",
            isLight ? "light" : "dark"
        );
    });


    /* =========================
       ACTIVE NAVIGATION
    ========================= */

    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });

    });


    /* =========================
       SCROLL REVEAL
    ========================= */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =========================
       PROJECT FILTER
    ========================= */

    const filters = document.querySelectorAll(".filter");
    const projects = document.querySelectorAll(".project-card");

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            filters.forEach(item => {
                item.classList.remove("active");
            });

            filter.classList.add("active");

            const category = filter.dataset.filter;

            projects.forEach(project => {

                const projectCategory = project.dataset.category;

                if (
                    category === "all" ||
                    projectCategory === category
                ) {
                    project.style.display = "block";

                    setTimeout(() => {
                        project.style.opacity = "1";
                        project.style.transform = "translateY(0)";
                    }, 20);

                } else {

                    project.style.opacity = "0";
                    project.style.transform = "translateY(10px)";

                    setTimeout(() => {
                        project.style.display = "none";
                    }, 250);
                }

            });

        });

    });


    /* =========================
       PROJECT MODAL
    ========================= */

    const modal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");
    const modalClose = document.getElementById("modalClose");
    const modalOk = document.getElementById("modalOk");

    const projectDescriptions = {

        "Smart AI":
            "Smart AI — sun’iy intellekt yordamida foydalanuvchilarga kundalik vazifalarni tez va samarali bajarishga yordam beruvchi texnologik startup.",

        "EduWay":
            "EduWay — o‘quvchilar uchun darslarni interaktiv, tushunarli va zamonaviy usulda o‘rganish imkonini beruvchi ta’lim platformasi.",

        "BizPro":
            "BizPro — kichik biznes egalari uchun mijozlar, vazifalar va biznes jarayonlarini boshqarishni osonlashtiruvchi raqamli yechim."
    };

    function openModal(projectName) {

        if (!modal) return;

        modalTitle.textContent = projectName;

        modalText.textContent =
            projectDescriptions[projectName] ||
            "Ushbu startup haqida batafsil ma’lumot.";

        modal.classList.add("show");

        document.body.style.overflow = "hidden";
    }

    function closeModal() {

        modal?.classList.remove("show");

        document.body.style.overflow = "";
    }

    document.querySelectorAll(".details-btn").forEach(button => {

        button.addEventListener("click", () => {
            openModal(button.dataset.project);
        });

    });

    modalClose?.addEventListener("click", closeModal);
    modalOk?.addEventListener("click", closeModal);

    modal?.addEventListener("click", event => {

        if (event.target === modal) {
            closeModal();
        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeModal();
        }

    });


    /* =========================
       STATISTICS COUNTER
    ========================= */

    const counters = document.querySelectorAll(".stat-number");

    const counterObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const target = Number(counter.dataset.target);

                let current = 0;

                const duration = 1400;
                const startTime = performance.now();

                function updateCounter(currentTime) {

                    const progress = Math.min(
                        (currentTime - startTime) / duration,
                        1
                    );

                    const easedProgress =
                        1 - Math.pow(1 - progress, 3);

                    current = Math.floor(target * easedProgress);

                    counter.textContent = current + "+";

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + "+";
                    }
                }

                requestAnimationFrame(updateCounter);

                counterObserver.unobserve(counter);
            });

        },
        {
            threshold: 0.5
        }
    );

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });


    /* =========================
       CONTACT FORM
    ========================= */

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    contactForm?.addEventListener("submit", event => {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {

            formMessage.textContent =
                "Iltimos, barcha maydonlarni to‘ldiring.";

            formMessage.style.color = "#ff6b6b";

            return;
        }

        formMessage.textContent =
            `Rahmat, ${name}! Xabaringiz qabul qilindi.`;

        formMessage.style.color = "#36e18a";

        contactForm.reset();

    });


    /* =========================
       BACK TO TOP
    ========================= */

    const topBtn = document.getElementById("topBtn");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {
            topBtn.classList.add("show");
        } else {
            topBtn.classList.remove("show");
        }

    });

    topBtn?.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =========================
       PREVENT # LINKS JUMPING
    ========================= */

    document.querySelectorAll('a[href="#"]').forEach(link => {

        link.addEventListener("click", event => {
            event.preventDefault();
        });

    });

});