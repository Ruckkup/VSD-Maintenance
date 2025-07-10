document.addEventListener('DOMContentLoaded', function() {
    
    // --- PART 1: PROGRESS BAR and CHECKLIST LOGIC ---
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('total-progress');
    const totalTasks = checkboxes.length;

    function updateProgress() {
        const checkedTasks = document.querySelectorAll('input[type="checkbox"]:checked').length;
        const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;
        
        progressBar.value = percentage;
        progressText.textContent = percentage;

        checkboxes.forEach((cb) => {
            if (cb.id) {
                localStorage.setItem(cb.id, cb.checked);
            }
        });
    }

    function loadProgress() {
        checkboxes.forEach((cb) => {
            if (cb.id) {
                cb.checked = localStorage.getItem(cb.id) === 'true';
            }
        });
        updateProgress();
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateProgress);
    });

    // --- PART 2: DYNAMIC MODAL LOGIC ---
    const contentTriggers = document.querySelectorAll('.content-trigger');
    const modal = document.getElementById('content-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');
    const overlay = document.getElementById('modal-overlay');
    const closeButton = modal.querySelector('.close-button');

    function openModal() {
        if (modal == null) return;
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal() {
        if (modal == null) return;
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    contentTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            
            const contentPath = trigger.getAttribute('data-content-path');
            if (!contentPath || contentPath === '#') {
                alert('Content for this topic is not available yet.');
                return;
            }
            
            const titleText = trigger.textContent;

            modalTitle.textContent = titleText;
            modalBody.innerHTML = '<div class="loader"></div>';
            openModal();

            fetch(contentPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`File not found: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // This simple approach is fine for trusted content.
                    // For user-generated content, you would need to sanitize it.
                    modalBody.innerHTML = html;
                })
                .catch(error => {
                    modalBody.innerHTML = `<p style="color: red; text-align: center;">Sorry, could not load the content.<br>Please check if the file exists at: <strong>${contentPath}</strong></p>`;
                    console.error('Fetch Error:', error);
                });
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // --- PART 3: COLLAPSIBLE SECTIONS LOGIC ---
    const sectionTitles = document.querySelectorAll('.section-title');

    sectionTitles.forEach(title => {
        title.addEventListener('click', () => {
            const sectionCard = title.closest('.section-card');
            sectionCard.classList.toggle('collapsed');
        });
    });

    // --- INITIALIZATION ---
    // Load progress from localStorage when the page loads
    if (totalTasks > 0) {
        loadProgress();
    }
});