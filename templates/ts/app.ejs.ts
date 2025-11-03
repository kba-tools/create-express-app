import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ExpressError } from './types/error'

import indexRouter from './routes/index'
import usersRouter from './routes/users'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// Catch-all for unmatched routes (404)
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: ExpressError = new Error('Page not found')
  error.status = 404
  next(error)
})

// Unified error handler
app.use(
  (err: ExpressError, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500
    const isDev = req.app.get('env') === 'development'

    res.locals.message = err.message || 'Something went wrong'
    res.locals.error = isDev ? err : {}

    res.status(status)
    res.render('error')
  }
)

export default app
