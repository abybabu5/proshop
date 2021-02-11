import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Mario Rossi',
        email: 'mariorossi@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Pippo Poppo',
        email: 'pippoppo@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
 ]

export default users
