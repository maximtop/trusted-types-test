type Header = {
    key: string,
    value: string,
}

type HeaderData = {
    id: HeaderId,
    cspHeader: Header
}

enum HeaderId {
    Default = 'default',
    Adguard = 'adguard',
    Script = 'script',
    Duplicates = 'duplicates',
    NoEval = 'no-eval',
}

enum HeaderKey {
    ContentSecurityPolicy = 'Content-Security-Policy',
}

type Headers = {
    [key in HeaderId]: HeaderData
}

const headers: Headers = {
    [HeaderId.Default]: {
        id: HeaderId.Default,
        cspHeader: {
            key: HeaderKey.ContentSecurityPolicy,
            value: 'trusted-types one two default'
        },
    },
    [HeaderId.Adguard]: {
        id: HeaderId.Adguard,
        cspHeader: {
            key: HeaderKey.ContentSecurityPolicy,
            value: 'trusted-types one two AGPolicy'
        },
    },
    [HeaderId.Script]: {
        id: HeaderId.Script,
        cspHeader: {
            key: HeaderKey.ContentSecurityPolicy,
            value: 'require-trusted-types-for \'script\''
        }
    },
    [HeaderId.Duplicates]: {
        id: HeaderId.Duplicates,
        cspHeader: {
            key: HeaderKey.ContentSecurityPolicy,
            value: 'trusted-types one two AGPolicy \'allow-duplicates\''
        }
    },
    [HeaderId.NoEval]: {
        id: HeaderId.NoEval,
        cspHeader: {
            key: HeaderKey.ContentSecurityPolicy,
            value: 'default-src \'self\'; script-src \'self\' https://trusted-types-test.maximtop.workers.dev/; block-all-mixed-content; upgrade-insecure-requests;'
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
        case `/${HeaderId.Default}`: {
            return getResponse(headers[HeaderId.Default]);
        }
        case `/${HeaderId.Adguard}`: {
            return getResponse(headers[HeaderId.Adguard]);
        }
        case `/${HeaderId.Script}`: {
            return getResponse(headers[HeaderId.Script]);
        }
        case `/${HeaderId.Duplicates}`: {
            return getResponse(headers[HeaderId.Duplicates]);
        }
        case `/${HeaderId.NoEval}`: {
            return getResponse(headers[HeaderId.NoEval]);
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
