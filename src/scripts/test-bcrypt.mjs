import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = postgres('postgresql://jvp_user:V3l4p4r3d3s@178.156.220.22:6432/ogess', { ssl: 'require' });

async function testAuth() {
    try {
        const users = await sql`SELECT id, dni, password_hash FROM employees WHERE dni = '12345678'`;
        if (users.length === 0) {
            console.log("User not found in DB.");
            return;
        }

        const user = users[0];
        console.log("Found user:", user.dni);
        console.log("DB Hash:", user.password_hash);

        const match = await bcrypt.compare('admin123', user.password_hash);
        console.log("Bcrypt compare result for 'admin123':", match);

    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}

testAuth();
