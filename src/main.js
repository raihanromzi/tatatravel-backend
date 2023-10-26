import { logger } from './application/logging.js'
import { web } from './application/web.js'

web.listen(process.env.PORT, (err) => {
    if (err) {
        logger.error(err)
    } else {
        logger.info('Server is running on port 3000')
    }
})
