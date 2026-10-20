export enum ResStatus {
    Success_But_Empty = 200,
    Accepted = 202, // Accepted (Login & Logut)
    CRUD = 201, // Cread & Update & Delete
    ValidationError = 400 ,
    NeedExtend = 401,
    Not_Authorized = 404 ,
    Forbidden = 403,
    User_Violation = 406,
    Server_Error = 500,
}
