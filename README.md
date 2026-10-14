# FindIt — Lost and Found Management System

This version keeps the frontend and backend in separate files:

- **HTML:** `index.html`, `report.html`, `detail.html`
- **CSS:** `assets/style.css`
- **JavaScript:** `assets/app.js` (connects the HTML pages to the PHP API)
- **PHP backend:** `config.php`, `api/items.php`, `api/report.php`, `api/item.php`
- **Database:** `database.sql`

## Run with XAMPP
1. Copy the `FindIt_Separate_Files` folder into `C:\xampp\htdocs\FindIt` (rename the folder to `FindIt`).
2. Start Apache and MySQL in XAMPP.
3. Open phpMyAdmin at `http://localhost/phpmyadmin/` and import `database.sql`.
4. Check database credentials in `config.php` (default XAMPP root user with blank password).
5. Visit `http://localhost/FindIt/index.html`.

Do not open the HTML files directly from the file system. They call PHP endpoints, so run them through Apache. The PHP endpoints use prepared statements and return JSON. The demo displays reporter contact details; use test data in public demos and add authentication/moderation before production use.
