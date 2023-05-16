export interface Bucket {
    id: string,
    name: string,
    value: number,
    weight: number
}

export interface User {
    Buckets: Bucket,
    PaycheckSeq: number,
    email: string,
    uid: string
}

export interface Snapshot {
    [userID: string]: User
}