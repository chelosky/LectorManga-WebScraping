import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';
// import { App } from "./app";

// const app = new App();

// app.start();

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString())
    const url = 'https://lectormanga.com/library/manga/9276/one-punch-man';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    await page.waitForTimeout(2000);

    const btn = await page.$('#show-chapters');
    await btn?.click();

    await page.waitForTimeout(2000);

    await page.$eval('ul.chapter-list', (container) => {
        const aTag = container?.querySelector('li')?.querySelector('div')?.querySelector('div:last-child')?.querySelector('a');
        aTag?.click();
    });



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
