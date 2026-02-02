export interface DbUser {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    member: boolean,
    admin: boolean,
}
