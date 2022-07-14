type Header = {
    key: string,
    value: string,
}

type HeaderData = {
    id: string,
    cspHeader: Header
}

type Headers = {
    [key: string]: HeaderData
}

const headers: Headers = {
    default: {
        id: 'default',
        cspHeader: {
            key: 'Content-Security-Policy',
            value: 'trusted-types one two default'
        },
    },
    adguard: {
        id: 'adguard',
        cspHeader: {
            key: 'Content-Security-Policy',
            value: 'trusted-types one two AGPolicy'
        },
    },
    script: {
        id: 'script',
        cspHeader: {
            key: 'Content-Security-Policy',
            value: 'require-trusted-types-for \'script\''
        }
    }
}

const renderPage = (header: HeaderData) => {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Trusted Types Test</title>
</head>
<body>
   <h1>${header.id}</h1>
   <a href="/">Back</a>
</body>
</html>`;
}

const getResponse = (header: HeaderData) => {
    return new Response(renderPage(header), {
        headers: {
            [header.cspHeader.key]: header.cspHeader.value,
            'content-type': 'text/html;charset=UTF-8',
        }
    });
}

const renderRoot = (headers: Headers) => {
    const headersItems = Object.keys(headers).map((key) => {
        return `<li><a href="/${key}">${key}</a></li>`;
    });

    const headersList = `<ul>${headersItems.join('')}</ul>`

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Trusted Types Test</title>
</head>
<body>
   ${headersList}
</body>
</html>`;
}

/**
 * Requests handler.
 * @param request
 */
const handleRequest = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const path = url.pathname;
    switch (path) {
        case '/':
            return new Response(renderRoot(headers), {
                headers: {
                    'content-type': 'text/html;charset=UTF-8',
                },
            });
        case `/${headers.default.id}`: {
            return getResponse(headers.default);
        }
        case `/${headers.adguard.id}`: {
            return getResponse(headers.adguard);
        }
        case `/${headers.script.id}`: {
            return getResponse(headers.script);
        }
        default:
            return new Response('404', { status: 404 });
    }
}

export default {
    async fetch(request: Request): Promise<Response> {
        return handleRequest(request);
    },
};
