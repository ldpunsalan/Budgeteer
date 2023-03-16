import { Express } from "express"

import login from './login'
import logout from './logout'

export default (app: Express) => {
    app.use('/login', login);
    app.use('/logout', logout)
}