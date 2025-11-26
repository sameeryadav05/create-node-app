import bcrypt from 'bcrypt';

export async function hashPassword(plainPassword:string):Promise<string>
{
    const hashedPassword = await bcrypt.hash(plainPassword,10)

    return hashedPassword;
}


export async function comparePassword(password:string,hashedPassword:string):Promise<boolean>
{
    const result  = await bcrypt.compare(password,hashedPassword);
    return result;
}