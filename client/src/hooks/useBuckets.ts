import { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'

import { db } from '../utils/firebase'

import { Bucket, Snapshot } from '../types'

/**
 * Fetches the buckets from firebase give the userID
 * 
 * @param userID 
 * @returns {
 *  loading: { loading, setLoading },
 *  current: { current, setCurrent },
 *  buckets: { buckets, setBuckets }
 * }
 */
function useBuckets(userID: string) {
    const [loading, setLoading] = useState<Boolean>(true)
    const [current, setCurrent] = useState<Bucket|null>()
    const [buckets, setBuckets] = useState<Bucket[]>([])

    useEffect(() => {
        const fetchBuckets = async() => {
            const snapshot = await get(ref(db))
            const data: Snapshot = snapshot.val()

            if (!data[userID].Buckets) {
                setBuckets([])
                setLoading(false)
            } else {
                const userBuckets = Object.entries(data[userID].Buckets)
                setCurrent(userBuckets[0][1])
                const bucketList: Bucket[] = userBuckets.map((cur) => cur[1])
                setBuckets(bucketList)
            }

            setLoading(false)
            
        }

        if (userID !== '') {
            fetchBuckets()
        }
    }, [userID])

    return {
        loading: { loading, setLoading },
        current: { current, setCurrent },
        buckets: { buckets, setBuckets }
    }
}

export default useBuckets