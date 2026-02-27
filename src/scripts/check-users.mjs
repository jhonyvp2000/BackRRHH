import postgres from 'postgres';

const sql = postgres('postgresql://jvp_user:V3l4p4r3d3s@178.156.220.22:6432/ogess', { ssl: 'require' });

async function main() {
    try {
        const users = await sql`SELECT id, dni, role FROM employees LIMIT 5`;
        console.log(users);
        if (users.length === 0) {
            console.log("No users in db, creating one");
            const newId = crypto.randomUUID();
            await sql`INSERT INTO employees (id, dni, password_hash, name, role) VALUES (${newId}, '12345678', 'admin123', 'Testing Admin', 'admin')`;
            console.log("Created user with id", newId);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
main();
