import { Express } from "express"

import login from './login'
import logout from './logout'
import session from './session'

export default (app: Express) => {
    app.use('/login', login);
    app.use('/logout', logout);
    app.use('/session', session);
}