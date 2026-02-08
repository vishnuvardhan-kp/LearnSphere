const db = require('./db');
db.query("UPDATE courses SET author = 'vinodh' WHERE author = '' OR author IS NULL", (err, result) => {
    if (err) {
        console.error("Error updating courses:", err);
    } else {
        console.log("Updated courses:", result.affectedRows);
    }
    db.end();
});
