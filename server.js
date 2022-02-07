const app = (require('express'))()
const puppeteer = require('puppeteer')

const websites = [
    {
        name: 'Tripadvisor',
        website: 'https://www.tripadvisor.ca/',
        signinButton: '.fGwNR._G.B-.z._S.c.Wc.ddFHE.fRPQK.w.fNnhN.brHeh',

    },

]

app.get('/', async (req, res) => {
    //could do it async / parallel with Promise.all (websites.map(website => {})....)
    //but we don't wanna overwhelm servers so we're going to do it in series
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]

    })
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
    )
    await page.goto('https://www.tripadvisor.ca/', {
        waitUntil: 'networkidle2',
    })
    await page.click('.fGwNR._G.B-.z._S.c.Wc.ddFHE.fRPQK.w.fNnhN.brHeh')
    await page.waitForTimeout(3000)
    await page.waitForSelector('iframe')
    console.log('success')
    await page.click('#ssoButtons button')
    await page.waitForTimeout(10000)




    // await browser.close();

    res.send({ message: 'hello' })
})

app.listen(8000, () => console.log('Server started on port 8000'))