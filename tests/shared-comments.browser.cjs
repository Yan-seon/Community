const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
let browser;try{browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const a=await browser.newContext({viewport:{width:1440,height:1000}}),b=await browser.newContext({viewport:{width:1440,height:1000}});
const p=await a.newPage(),q=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
let realtime=false;q.on('websocket',ws=>ws.on('framereceived',frame=>{if(String(frame.payload).includes('Window light changed the swatch. I used a thin layer.'))realtime=true;}));
await Promise.all([p.goto((process.env.TEST_URL||'http://127.0.0.1:4180')+'/?post=A&lang=en'),q.goto((process.env.TEST_URL||'http://127.0.0.1:4180')+'/?post=A&lang=en')]);
await p.getByLabel('Display name or participant code').fill('TEST Alice');
const followBody='TEST follow-up '+Date.now()+': What lighting did you use?';
const body='TEST '+Date.now()+': Window light changed the swatch. I used a thin layer.';
await p.getByLabel('Your comment',{exact:true}).fill(body);
await p.getByLabel('Publish this comment to this test discussion.').check();
await p.getByRole('button',{name:'Publish comment',exact:true}).click();
await p.locator('.cg-live-comment').filter({hasText:body}).waitFor({timeout:30000});
await q.locator('.cg-live-comment').filter({hasText:body}).waitFor({timeout:20000});
if(!realtime)throw Error('Realtime message was not received');console.log('PASS cross-browser comment shared over Realtime');
await q.reload();await q.locator('.cg-live-comment').filter({hasText:body}).waitFor();console.log('PASS refresh persistence');
const row=q.locator('.cg-live-comment').filter({hasText:body});await row.getByText('Reply to a sentence',{exact:true}).click();await row.locator('.cg-sentence-list button').first().click();
await q.getByRole('button',{name:'Help me follow up on this sentence',exact:true}).click();
await q.getByRole('button',{name:'Use as an editable draft',exact:true}).click();
await q.getByLabel('Your comment',{exact:true}).fill(followBody);
await q.getByLabel('Publish this comment to this test discussion.').check();await q.getByRole('button',{name:'Publish comment',exact:true}).click();
const follow=p.locator('.cg-live-comment').filter({hasText:followBody});await follow.waitFor({timeout:20000});if(!await follow.locator('blockquote').innerText().then(x=>x.includes('TEST Alice')))throw Error('Wrong quote author');console.log('PASS quoted sentence retains real author');
await p.getByRole('button',{name:'Ask about this image',exact:true}).click();await p.locator('.cg-anchor-image').click({position:{x:150,y:100}});
await p.getByRole('button',{name:'Find a useful prompt',exact:true}).click();await p.getByRole('button',{name:'Use as an editable draft',exact:true}).click();await p.getByRole('button',{name:'Share my question',exact:true}).click();
await p.getByRole('button',{name:'Open member reply',exact:true}).waitFor();await q.reload();const pin=q.locator('.cg-live-comment').filter({hasText:'Question'}).last();await pin.locator('.cg-live-image .cg-pin').waitFor();console.log('PASS pinned question visible to another visitor');
await q.screenshot({path:process.env.TEST_SCREENSHOT||'/tmp/community-realtime.png',fullPage:true});console.log('Page errors',JSON.stringify(errors));
}finally{if(browser)await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
