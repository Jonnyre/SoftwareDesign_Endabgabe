export function IsValidUsername(_userName: string): boolean {
    let regNoSpecialCharacters: RegExp = new RegExp(/^[a-z0-9]+$/gi);
    return regNoSpecialCharacters.test(_userName);
}