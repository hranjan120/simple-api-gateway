const config = require('config');

/*---------------*/
function onError(err, req, res, target) {
    console.log(err);
    return res.status(500).json({ statusCode: 'ERROR', statusValue: 500, message: 'Unable to process your request' });
}

const ROUTES = [
    {
        url: '/order',
        auth: true,
        creditCheck: false,
        rateLimit: {
            windowMs: 15 * 60 * 1000,  // 15 minutes
            max: 200,  // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        },
        proxy: {
            target: config.get('orderServiceUrl'),
            changeOrigin: true,
            pathRewrite: {
                [`^/order`]: '',
            },
            onError
        }
    },
    {
        url: '/shop',
        auth: true,
        creditCheck: true,
        proxy: {
            target: config.get('shopServiceUrl'),
            changeOrigin: true,
            pathRewrite: {
                [`^/shop`]: '',
            },
            onError
        }
    },
    {
        url: '/user',
        auth: true,
        creditCheck: true,
        rateLimit: {
            windowMs: 15 * 60 * 1000,  // 15 minutes
            max: 200,  // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        },
        proxy: {
            target: config.get('userServiceUrl'),
            changeOrigin: true,
            pathRewrite: {
                [`^/user`]: '',
            },
            onError
        }
    }
]

exports.ROUTES = ROUTES;
