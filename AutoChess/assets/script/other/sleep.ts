export function sleep(ms: number): Promise<void> 
{
    return new Promise(async (resolve) => 
    {
        let st = setTimeout(() => 
        {
            clearTimeout(st);
            resolve();
        }, ms);
    });
}

export function delay(ms: number, release: () => void): Promise<void> 
{
    return new Promise((resolve) =>
    {
        let st = setTimeout(async () =>
        {
            clearTimeout(st);
            await release();
            resolve();
        }, ms);
    });
}