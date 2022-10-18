import JsonBigint from "json-bigint";


const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL) ? process.env.REACT_APP_BACKEND_URL : 'http://localhost:8000'
const REQUEST_TIMEOUT_SEC = 60000

export async function callDalleBackend(text: string) {
    const queryStartTime = new Date().getTime();
    
    const response = await Promise.race([
        (await fetch(BACKEND_URL + `/dalle`, {
            method: 'POST',
            headers: {
                'Bypass-Tunnel-Reminder': "go"
            },
            body: JSON.stringify({ text })
        }
        ).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response
        })).text(), new Promise((_, reject) => setTimeout(
            () => reject(new Error('Timeout')), REQUEST_TIMEOUT_SEC))
    ]);

    return {
        'executionTime': Math.round(((new Date().getTime() - queryStartTime) / 1000 + Number.EPSILON) * 100) / 100,
        'serverResponse': JsonBigint.parse(response as string)
    }
}
