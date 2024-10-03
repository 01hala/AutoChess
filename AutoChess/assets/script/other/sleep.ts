export function sleep(ms: number): Promise<void> 
{
    return new Promise(async (resolve) => 
    {
        await setTimeout(() => 
        {
            resolve();
        }, ms);
    });
}

export function delay(ms: number, release: () => void): Promise<void> 
{
    return new Promise((resolve) =>
    {
        setTimeout(async () =>
        {
            await release();
            resolve();
        }, ms);
    });
}