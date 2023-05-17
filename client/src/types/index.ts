export interface Purchase {
    id: number,
    name: string,
    value: number,
    bucketid: string,
    date: string
}

export interface Bucket {
    id: string,
    name: string,
    value: number,
    weight: number,
    Purchases: {
        [id: number]: Purchase
    }
}

export interface Delta {
    id: string,
    delta: number
}

export interface Paycheck {
    id: number,
    changes: Delta[]
}

export interface User {
    Buckets: {
        [id: string]: Bucket
    },
    Paychecks: {
        [id: number]: Paycheck
    }
    PaycheckSeq: number,
    email: string,
    uid: string
}

export interface Snapshot {
    [userID: string]: User
}