import bcrypt from 'bcrypt';

export async function hashPassword(plainPassword)
{
    const hashedPassword = await bcrypt.hash(plainPassword,10)

    return hashedPassword;
}


export async function comparePassword(password,hashedPassword)
{
    const result  = await bcrypt.compare(password,hashedPassword);
    return result;
}