// import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-extra'
import Adblocker from 'puppeteer-extra-plugin-adblocker'
import UserAgent from 'user-agents';
// import { App } from "./app";

// const app = new App();

// app.start();

(async () => {
    puppeteer.use(Adblocker({ blockTrackers: true }))
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString())
    // const url = 'https://lectormanga.com/library/manga/9276/one-punch-man';
    const url = 'https://lectortmo.com/library/manga/9276/one-punch-man';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const btn = await page.$('#show-chapters');
    await btn?.click();

    const mangaUrl = await page.$eval('ul.chapter-list', (container) => {
        const aTag = container?.querySelector('li')?.querySelector('div')?.querySelector('div:last-child')?.querySelector('a');
        // aTag?.click();
        return aTag?.getAttribute('href');
    });

    const page2 = await browser.newPage();
    await page2.goto(mangaUrl!, {
        timeout: 0
    });

    let currentUrl = await page2.url();
    console.log(currentUrl); //https://lectortmo.com/viewer/9ff6ac0bffca62d6fe5866c3cace2d90/paginated

    currentUrl = currentUrl.replace('paginated', 'cascade');

    console.log(currentUrl);

    const client = await page2.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');

    const page3 = await browser.newPage();
    await page3.goto(currentUrl);

    const imageUrls = await page3.$$eval('img.viewer-img', (imgs) => {
        return imgs.map((img) => img.getAttribute('data-src')?.replace('japanreader', 'recipesandcook'));
    });

    console.log(imageUrls);

    await page3.goto(imageUrls[0] as string);
    

    // await page.$eval('ul.chapter-list', (container) => {
    //     const aTag = container?.querySelector('li')?.querySelector('div')?.querySelector('div:last-child')?.querySelector('a');
    //     aTag?.click();
    // });
    // const url = await newPage.evaluate(() => document.location.href);
    // const url = await page.url();



    // const episodesLinks = await page.$$eval('ul.chapter-list', (containers) => {
    //     return containers.map((container) => {
    //         const episode = container.querySelectorAll('li')[0];
    //         const episodeUrl = episode.querySelector('div')?.querySelector('div:last-child')?.querySelector('a')?.getAttribute('href');
    //         return episodeUrl;
    //     });
    // });
    // console.log(episodesLinks);

    // document.querySelector('a[title="Cascada"]').click()
    // document.querySelectorAll('img.viewer-image')[22].getAttribute('data-src')
})();
