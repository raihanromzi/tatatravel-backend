import { logger } from './application/logging.js'
import { web } from './application/web.js'

web.listen(3000, () => {
    logger.info('Server is running on port 3000')
})
