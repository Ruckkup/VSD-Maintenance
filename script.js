document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('total-progress');
    const totalTasks = checkboxes.length;

    function updateProgress() {
        const checkedTasks = document.querySelectorAll('input[type="checkbox"]:checked').length;
        const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;
        
        // อัปเดต Progress bar และข้อความ
        progressBar.value = percentage;
        progressText.textContent = percentage;

        // บันทึกสถานะของ checkbox แต่ละตัว
        checkboxes.forEach((cb, index) => {
            localStorage.setItem('task_' + index, cb.checked);
        });
    }

    function loadProgress() {
        checkboxes.forEach((cb, index) => {
            // อ่านค่าที่เคยบันทึกไว้ ถ้าไม่มี ให้เป็น false (ยังไม่ติ๊ก)
            const isChecked = localStorage.getItem('task_' + index) === 'true';
            cb.checked = isChecked;
        });
        // คำนวณความคืบหน้าหลังจากโหลดข้อมูล
        updateProgress();
    }

    // เพิ่ม Event Listener ให้กับทุก Checkbox
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateProgress);
    });

    // โหลดข้อมูลความคืบหน้าเมื่อเปิดหน้าเว็บ
    loadProgress();
});