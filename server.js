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

    await page.waitForSelector('iframe')
    console.log('iframe loaded')

    const elementHandle = await page.$('iframe[src="/RegistrationController?flow=sign_up_and_save&flowOrigin=login&pid=40486&hideNavigation=true&userRequestedForce=true&returnTo=&isLithium=true&locationId=-1&requireSecure=false"]')

    const frame = await elementHandle.contentFrame()
    await frame.waitForTimeout(3000)
    await frame.waitForSelector('#ssoButtons')
    await frame.click('.regEmailContinue')

    await frame.waitForSelector('#regSignIn')
    await frame.waitForSelector('.showHidePasswordButton')
    console.log('found sign in')
    await frame.waitForTimeout(3000)
    await frame.click('#regSignIn .coreRegTextLink')
    console.log('clicked')
    // await frame.click('button')


    await frame.waitForTimeout(5000)
    await page.waitForTimeout(10000)
    await browser.close();

    res.send({ message: 'hello' })
})

app.listen(8000, () => console.log('Server started on port 8000'))